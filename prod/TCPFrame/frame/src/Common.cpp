#include "stdafx.h"
#include <string>
#include <set>
#include <map>
#include <boost/thread/locks.hpp>
#include <boost/thread/shared_mutex.hpp>
#include <boost/thread.hpp>

#include "Common.h"

boost::shared_mutex portHandlerMutex; 
std::map<short, std::pair<UINT, EventStruct>> portHandler;

boost::shared_mutex moduleHandlerMutex; 
std::map<HMODULE, EventStruct> moduleHandler;

std::set<std::wstring> loadedModules;

bool getModuleInfo(const std::wstring& folderPath, UINT& iVersion, UINT& iPort, std::wstring& strDllPath)
{
	if (loadedModules.find(folderPath) != loadedModules.end())
	{
		return false;
	}
	loadedModules.insert(folderPath);

	iVersion = GetPrivateProfileIntW(L"Server", L"Version", -1, (folderPath + L"\\config.ini").c_str());
	iPort = GetPrivateProfileIntW(L"Server", L"Port", 0, (folderPath + L"\\config.ini").c_str());

	WCHAR dllName[MAX_PATH] = { 0 };
	DWORD dwRet = GetPrivateProfileStringW(L"DllInfo", L"Name", nullptr, dllName, MAX_PATH, (folderPath + L"\\config.ini").c_str());
	if (iVersion == -1 || iPort == 0 || wcslen(dllName) == 0)
	{
		return false;
	}

	strDllPath = folderPath + L'\\' + dllName;

	return true;
}

void tryToload(const std::map<short, std::pair<UINT, std::wstring>>& portVersion, PInitParam param)
{
	for (std::map<short, std::pair<UINT, std::wstring>>::const_iterator cit = portVersion.begin(); cit != portVersion.end(); cit++)
	{
		bool bNeedLoad = false;
		{
			boost::shared_lock<boost::shared_mutex> readLock(portHandlerMutex);

			std::map<short, std::pair<UINT, EventStruct>>::const_iterator it = portHandler.find(cit->first);
			if (it != portHandler.end())
			{
				if (it->second.first < cit->second.first)
				{
					bNeedLoad = true;
				}
			}
			else
			{
				bNeedLoad = true;
			}
		}

		if (bNeedLoad)
		{
			HMODULE hModule = LoadLibraryW(cit->second.second.c_str());
			if (hModule == nullptr)
			{
				return;
			}

			EventStruct::InitFunc Init = (EventStruct::InitFunc)GetProcAddress(hModule, "Init");

			EventStruct eventStruct = { 0 };
			eventStruct.ServerStartEvent = (EventStruct::ServerStartEventFunc)GetProcAddress(hModule, "ServerStartEvent");
			eventStruct.EndEvent = (EventStruct::EndEventFunc)GetProcAddress(hModule, "EndEvent");
			eventStruct.ReceiveDataEvent = (EventStruct::ReceiveDataEventFunc)GetProcAddress(hModule, "ReceiveDataEvent");
			eventStruct.SendDataCompleteEvent = (EventStruct::SendDataCompleteEventFunc)GetProcAddress(hModule, "SendDataCompleteEvent");
			eventStruct.ConnectCompleteEvent = (EventStruct::ConnectCompleteEventFunc)GetProcAddress(hModule, "ConnectCompleteEvent");
			if (Init == nullptr || eventStruct.ServerStartEvent == nullptr || eventStruct.EndEvent == nullptr || eventStruct.ReceiveDataEvent == nullptr
				|| eventStruct.SendDataCompleteEvent == nullptr || eventStruct.ConnectCompleteEvent == nullptr)
			{
				FreeLibrary(hModule);
				return;
			}

			Init(param);

			{
				boost::unique_lock<boost::shared_mutex> writeLock(portHandlerMutex);

				portHandler[cit->first] = std::make_pair(cit->second.first, eventStruct);
			}

			{
				boost::unique_lock<boost::shared_mutex> writeLock(moduleHandlerMutex);

				moduleHandler[hModule] = eventStruct;
			}
		}
	}

	return;
}

void scanModules(PInitParam param)
{
	WCHAR currentPath[MAX_PATH] = { 0 };
	GetModuleFileNameW(nullptr, currentPath, MAX_PATH);

	std::wstring strPath = currentPath; 
	std::wstring::size_type position = strPath.find_last_of(L'\\');
	if (position != std::wstring::npos)
	{
		strPath.erase(position);
	}
	strPath += L"\\modules"; 

	std::map<short, std::pair<UINT, std::wstring>> portVersion;

	WIN32_FIND_DATA ffd = { 0 };
	HANDLE hFind = FindFirstFileW((strPath + L"\\*").c_str(), &ffd);

	do
	{
		if (ffd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
		{
			if ( 0 != wcscmp(ffd.cFileName, L".") && 0 != wcscmp(ffd.cFileName, L".."))
			{
				UINT iVersion = 0;
				UINT iPort = 0;
				std::wstring strDllPath;

				if (getModuleInfo(strPath + L'\\' + ffd.cFileName, iVersion, iPort, strDllPath))
				{
					std::map<short, std::pair<UINT, std::wstring>>::iterator it = portVersion.find(iPort);
					if (it == portVersion.end())
					{
						portVersion[iPort] = std::make_pair(iVersion, strDllPath);
					}
					else
					{
						if (it->second.first < iVersion)
						{
							portVersion[iPort] = std::make_pair(iVersion, strDllPath);
						}
					}
				}
			}
		}
	}
	while (FindNextFileW(hFind, &ffd) != 0);
	FindClose(hFind);
	tryToload(portVersion, param);
	return;
}

void GetPorts(std::vector<short>& ports)
{	
	boost::shared_lock<boost::shared_mutex> readLock(portHandlerMutex);

	for (std::map<short, std::pair<UINT, EventStruct>>::const_iterator cit = portHandler.begin(); cit != portHandler.end(); cit++)
	{
		ports.push_back(cit->first);
	}
}

bool getPortEvents(short port, EventStruct& events)
{
	boost::shared_lock<boost::shared_mutex> readLock(portHandlerMutex);

	std::map<short, std::pair<UINT, EventStruct>>::const_iterator cit = portHandler.find(port);
	if (cit != portHandler.end())
	{
		events = cit->second.second;
		return true;
	}

	return false;
}

bool getModuleEvents(HMODULE module, EventStruct& events)
{
	boost::shared_lock<boost::shared_mutex> readLock(moduleHandlerMutex);

	std::map<HMODULE, EventStruct>::const_iterator cit = moduleHandler.find(module);
	if (cit != moduleHandler.end())
	{
		events = cit->second;
		return true;
	}

	return false;
}


