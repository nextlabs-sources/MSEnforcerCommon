#pragma once

#include "TcpSocket.h"
#include "Common.h"

using boost::asio::ip::tcp;

class FrameServer
{
public:
	FrameServer(boost::asio::io_context& io_context, short port) : port_(port), io_context_(io_context), acceptor_(io_context, tcp::endpoint(tcp::v4(), port_))
	{
		start_accept();
	}

	void start_accept();
	void handle_accept(boost::shared_ptr<TcpSocket> tcpSocket, const boost::system::error_code& error);

private:
	short port_;
	boost::asio::io_context& io_context_;
	tcp::acceptor acceptor_;
};

