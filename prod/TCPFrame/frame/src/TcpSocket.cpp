#include "stdafx.h"
#include "TcpSocket.h"

void TcpSocket::Read()
{
	socket_.async_read_some(boost::asio::buffer(data_, max_length),
							boost::bind(&TcpSocket::handle_read, shared_from_this(), boost::asio::placeholders::error, boost::asio::placeholders::bytes_transferred));
}

void TcpSocket::handle_read(const boost::system::error_code& error, size_t bytes_transferred)
{
	if (!error)
	{
		events_.ReceiveDataEvent(shared_from_this(), data_, bytes_transferred);
		Read();
	}
	else
	{
		events_.EndEvent(shared_from_this(), error);
	}
}

void TcpSocket::Write(BYTE* data, int length)
{
	boost::asio::async_write(socket_, boost::asio::buffer(data, length),
							 boost::bind(&TcpSocket::handle_write, shared_from_this(), boost::asio::placeholders::error));
}

void TcpSocket::BlockWrite(BYTE* data, int length, boost::system::error_code& error)
{
	boost::asio::write(socket_, boost::asio::buffer(data, length), error);
}

void TcpSocket::handle_write(const boost::system::error_code& error)
{
	events_.SendDataCompleteEvent(shared_from_this(), error);
}

void TcpSocket::Connect(const boost::asio::ip::tcp::resolver::iterator& endpoint_iterator)
{
	boost::asio::async_connect(socket_, endpoint_iterator,  
							   boost::bind(&TcpSocket::handle_connect, shared_from_this(), boost::asio::placeholders::error));
}

void TcpSocket::handle_connect(const boost::system::error_code& error)  
{  
	events_.ConnectCompleteEvent(shared_from_this(), error);

	if (!error)  
	{  
		Read();
	}  
}  