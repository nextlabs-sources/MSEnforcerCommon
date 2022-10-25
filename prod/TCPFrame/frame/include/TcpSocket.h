#pragma once

#include <boost/asio.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/bind.hpp>

#ifndef DEFINE_SERVICE_PARAMS
typedef struct ServiceParams {
	//a service status handle if registered as a service, otherwise, NULL
	SERVICE_STATUS_HANDLE _service_handle;
} InitParam, *PInitParam;
#define DEFINE_SERVICE_PARAMS
#endif

class TcpSocket;

struct EventStruct {
	typedef void(*InitFunc)(PInitParam param);
	typedef void (*ServerStartEventFunc)(boost::shared_ptr<TcpSocket> tcpSocket);
	typedef void (*EndEventFunc)(boost::shared_ptr<TcpSocket> tcpSocket, const boost::system::error_code& error);
	typedef void (*ReceiveDataEventFunc)(boost::shared_ptr<TcpSocket> tcpSocket, BYTE* data, int length);
	typedef void (*SendDataCompleteEventFunc)(boost::shared_ptr<TcpSocket> tcpSocket, const boost::system::error_code& error);
	typedef void (*ConnectCompleteEventFunc)(boost::shared_ptr<TcpSocket> tcpSocket, const boost::system::error_code& error);

	ServerStartEventFunc		ServerStartEvent;
	EndEventFunc				EndEvent;
	ReceiveDataEventFunc		ReceiveDataEvent;
	SendDataCompleteEventFunc	SendDataCompleteEvent;
	ConnectCompleteEventFunc	ConnectCompleteEvent;
};

class TcpSocket : public boost::enable_shared_from_this<TcpSocket>
{
public:
	TcpSocket(boost::asio::io_context& io_context, const EventStruct& events)
		: socket_(io_context)
		, events_(events)
		, m_data(nullptr)
		, m_outgoing(false)
	{
	}

	boost::asio::ip::tcp::socket& socket()
	{
		return socket_;
	}

	const EventStruct& events() const
	{
		return events_;
	}

	void Read();
	void Write(BYTE* data, int length);
	void BlockWrite(BYTE* data, int length, boost::system::error_code& error);

	void Connect(const boost::asio::ip::tcp::resolver::iterator& endpoint_iterator);

	void SetData(void* data) { m_data = data; }
	void* GetData() const { return m_data; }

	void SetOutgoing(bool value) { m_outgoing = value; }
	bool IsOutgoing() const { return m_outgoing; }
private:
	void handle_read(const boost::system::error_code& error, size_t bytes_transferred);
	void handle_write(const boost::system::error_code& error);

	void handle_connect(const boost::system::error_code& error);

private:
	boost::asio::ip::tcp::socket socket_;
	EventStruct events_;
	void* m_data;
	//Is this a active socket to the Server (the back-end server) from the local (the Proxy itself)
	//Active sockets may be created by accept() or connect(), named, incoming and outgoing connections.
	//https://serverfault.com/questions/443038/what-does-incoming-and-outgoing-traffic-mean
	//https://stackoverflow.com/questions/4696812/passive-and-active-sockets
	//http://man7.org/linux/man-pages/man2/listen.2.html
	bool m_outgoing;

	enum { max_length = 4096 };
	BYTE data_[max_length];
};

