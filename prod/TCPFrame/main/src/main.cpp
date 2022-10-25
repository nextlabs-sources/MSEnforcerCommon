// main.cpp : Defines the entry point for the application.
//

#include "stdafx.h"
#include "main.h"
#include <stdio.h>

typedef struct ServiceParams {
	//a service status handle if registered as a service, otherwise, NULL
	SERVICE_STATUS_HANDLE _service_handle;
} InitParam, *PInitParam;

typedef void(*TCPFrameFunEntryPoint)(PInitParam param);

InitParam g_Param;

void setServiceStatus(DWORD status)
{
	SERVICE_STATUS serviceStatus;
	serviceStatus.dwServiceType              = SERVICE_WIN32_OWN_PROCESS;
	serviceStatus.dwWin32ExitCode            = NO_ERROR;
	serviceStatus.dwServiceSpecificExitCode  = 0;
	serviceStatus.dwWaitHint                 = 0;
	serviceStatus.dwCheckPoint               = 0;
	serviceStatus.dwControlsAccepted         = SERVICE_ACCEPT_SHUTDOWN | SERVICE_ACCEPT_STOP;
	serviceStatus.dwCurrentState = status;

	SetServiceStatus(g_Param._service_handle, &serviceStatus);
}

VOID WINAPI ServiceHandler(DWORD controlCode)
{
	switch (controlCode)
	{
	case SERVICE_CONTROL_PAUSE:
		setServiceStatus(SERVICE_PAUSED);           break;
	case SERVICE_CONTROL_SHUTDOWN:
		setServiceStatus(SERVICE_STOPPED);          break;
	case SERVICE_CONTROL_STOP:
		setServiceStatus(SERVICE_STOPPED);          break;
	default:
		break;
	}
}

TCPFrameFunEntryPoint GetEntryPointFromFrame()
{
	//load tcp frame
    WCHAR wsModule[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, wsModule, MAX_PATH);
    WCHAR* p = wcsrchr(wsModule, L'\\');
    if (p)
    {
        *p = 0;
        wcscat_s(wsModule, L"\\frame.dll");

        HMODULE hFrame = ::LoadLibraryW(wsModule);
        if (NULL == hFrame) {
            wprintf(L"Load %s failed! err: %d\n", wsModule, GetLastError());
            return NULL;
        }
        TCPFrameFunEntryPoint EntryPoint = (TCPFrameFunEntryPoint) ::GetProcAddress(hFrame, "EntryPoint");

        return EntryPoint;
    }
    else
        return NULL;
}


int ConsoleMain(DWORD argc, LPWSTR *argv)
{

	//load tcp frame
	TCPFrameFunEntryPoint EntryPoint = GetEntryPointFromFrame();
	
	if (EntryPoint)
	{
		ZeroMemory(&g_Param, sizeof(g_Param));
		EntryPoint(&g_Param);
	}
	else
	{
		printf("Get EntryPoint from frame.dll failed.\n");
	}
	return 0;
}


VOID WINAPI ServiceMain(DWORD argc, LPWSTR *argv)
{

	//load tcp frame
	TCPFrameFunEntryPoint EntryPoint = GetEntryPointFromFrame();

	g_Param._service_handle = RegisterServiceCtrlHandlerW(L"", &ServiceHandler);
	if (g_Param._service_handle == 0)
	{
		OutputDebugStringW(L"RegisterServiceCtrlHandlerW failed\n");
		exit(-1);
	}

	OutputDebugStringW(L"RegisterServiceCtrlHandlerW successfully\n");

	setServiceStatus(SERVICE_RUNNING);

    if (EntryPoint)
	    EntryPoint(&g_Param);
}

const wchar_t* GetModeFromArgument(DWORD argc, LPWSTR *argv)
{
	wchar_t* szMode = L"service";
	for (DWORD i=0; i<argc; i++)
	{
		if (wcsicmp(argv[i], L"-mode") == 0)
		{
			i++;
			if (i<argc)
			{
			    szMode = argv[i];
			}
		}
	}

	return szMode;
}

int wmain(DWORD argc, LPWSTR *argv)
{
	const wchar_t* wszMode = GetModeFromArgument(argc, argv);

	//get mode from argument
	if (wcsicmp(wszMode, L"console")==0)
	{
		OutputDebugStringW(L"Proxymain run as console mode.\n");
		ConsoleMain(argc, argv);
	}
	else
	{
		OutputDebugStringW(L"Proxymain run as serice mode.\n");

		const SERVICE_TABLE_ENTRYW serviceTable[] = {
			{ L"NxlSqlEnforcer", ServiceMain },
			{ NULL, NULL }
		};

		if (!StartServiceCtrlDispatcherW(&serviceTable[0]))
		{
			OutputDebugStringW(L"StartServiceCtrlDispatcherW failed\n");
			return 0;
		}

		OutputDebugStringW(L"StartServiceCtrlDispatcherW successfully\n");
	}

	return 0;
}