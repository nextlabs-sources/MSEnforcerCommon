#include "stdafx.h"
#include "FrameServer.h"

void FrameServer::start_accept()
{
	EventStruct events;

	if (!getPortEvents(port_, events))
	{
		return;
	}

	boost::shared_ptr<TcpSocket> tcpSocket(new TcpSocket(io_context_, events));
	acceptor_.async_accept(tcpSocket->socket(), boost::bind(&FrameServer::handle_accept, this, tcpSocket, boost::asio::placeholders::error));
}

void FrameServer::handle_accept(boost::shared_ptr<TcpSocket> tcpSocket, const boost::system::error_code& error)
{
	if (!error)
	{
		tcpSocket->events().ServerStartEvent(tcpSocket);
		tcpSocket->Read();
	}

	start_accept();
}