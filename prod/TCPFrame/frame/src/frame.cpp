// frame.cpp : Defines the exported functions for the DLL application.
//

#include "stdafx.h"
#include <string>
#include <set>
#include <map>
#include <boost/thread/locks.hpp>
#include <boost/thread/shared_mutex.hpp>
#include <boost/thread.hpp>

#include "frame.h"
#include "FrameServer.h"

using boost::asio::ip::tcp;

DWORD WINAPI TimerProc(_In_ LPVOID);
DWORD WINAPI ClientsProc(_In_ LPVOID);

boost::asio::io_context* pClientsioContext = nullptr;

FRAME_API void EntryPoint(PInitParam param)
{
	scanModules(param);

	std::vector<short> ports;
	GetPorts(ports);
	if (ports.empty())
	{
		return;
	}

	CreateThread(nullptr, 0, TimerProc, param, 0, nullptr);

	pClientsioContext = new boost::asio::io_context;
	CreateThread(nullptr, 0, ClientsProc, nullptr, 0, nullptr);

	//https://www.boost.org/doc/libs/1_70_0/doc/html/boost_asio/reference/io_context/stop.html
	while (true)
	{
		try
		{
			boost::asio::io_context ioContext;

			std::vector<boost::shared_ptr<FrameServer>> servers;
			for (std::size_t i = 0; i < ports.size(); i++)
			{
				boost::shared_ptr<FrameServer> server(new FrameServer(ioContext, ports[i]));
				servers.push_back(server);
			} 

			std::vector<boost::shared_ptr<boost::thread>> threads; 
			for (std::size_t i = 0; i < boost::thread::hardware_concurrency(); i++)
			{
				boost::shared_ptr<boost::thread> thread(new boost::thread(boost::bind(&boost::asio::io_service::run, &ioContext)));
				threads.push_back(thread);
			}

			ioContext.run();

			for (std::size_t i = 0; i < threads.size(); i++)
			{
				threads[i]->join();
			} 
		}
		catch (std::exception& e)
		{
			e;
		}
	}

	return;
}

FRAME_API void Close(boost::shared_ptr<TcpSocket> tcpSocket)
{
	try
	{
		tcpSocket->socket().close();
	}
	catch (std::exception& e)
	{
		e;
	}

	return;
}

FRAME_API bool Connect(const char* ip, const char* port, HMODULE hModule, void* data)
{
	EventStruct events;

	if (!getModuleEvents(hModule, events))
	{
		return false;
	}

	boost::asio::io_service io_service;  

	boost::asio::ip::tcp::resolver resolver(io_service);  
	boost::asio::ip::tcp::resolver::query query(ip, port);
	boost::asio::ip::tcp::resolver::iterator iterator = resolver.resolve(query); 

	auto tcpSocket = boost::make_shared<TcpSocket>(*pClientsioContext, events);
	tcpSocket->SetData(data);
	tcpSocket->Connect(iterator);
	return true;
}

FRAME_API bool BlockConnect(const char* ip, const char* port, HMODULE hModule, boost::shared_ptr<TcpSocket>& tcpSocket, boost::system::error_code& error)
{
	EventStruct events;

	if (!getModuleEvents(hModule, events))
	{
		return false;
	}

	boost::asio::io_service io_service;  

	boost::asio::ip::tcp::resolver resolver(io_service);  
	boost::asio::ip::tcp::resolver::query query(ip, port);
	boost::asio::ip::tcp::resolver::iterator iterator = resolver.resolve(query);

	boost::shared_ptr<TcpSocket> newTcpSocket(new TcpSocket(*pClientsioContext, events));
	newTcpSocket->SetData(tcpSocket.get()?tcpSocket->GetData():NULL);
	boost::asio::connect(newTcpSocket->socket(), iterator, error);

	if (!error)  
	{
		tcpSocket = newTcpSocket;
		newTcpSocket->Read();
		return true;
	} 
	else
	{
		return false;
	}
}

FRAME_API void SendData(boost::shared_ptr<TcpSocket> tcpSocket, BYTE* data, int length)
{
	tcpSocket->Write(data, length);
}

FRAME_API void BlockSendData(boost::shared_ptr<TcpSocket> tcpSocket, BYTE* data, int length, boost::system::error_code& error)
{
	tcpSocket->BlockWrite(data, length, error);
}

DWORD WINAPI ClientsProc(_In_ LPVOID)
{
	while (true)
	{
		try
		{
			boost::asio::io_context::work worker(*pClientsioContext); 

			std::vector<boost::shared_ptr<boost::thread>> threads; 
			for (std::size_t i = 0; i < boost::thread::hardware_concurrency(); i++)
			{
				boost::shared_ptr<boost::thread> thread(new boost::thread(boost::bind(&boost::asio::io_service::run, pClientsioContext)));
				threads.push_back(thread);
			}

			pClientsioContext->run();

			for (std::size_t i = 0; i < threads.size(); i++)
			{
				threads[i]->join();
			} 
		}
		catch (std::exception& e)
		{
			e;
		}
	}

	return 0;
}

DWORD WINAPI TimerProc(_In_ LPVOID param)
{
	while (true)
	{
		Sleep(6 * 60 * 60 * 1000);
		scanModules((PInitParam)param);
	}
	return 0;
}