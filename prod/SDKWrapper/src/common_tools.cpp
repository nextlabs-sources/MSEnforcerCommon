/**
*  @file add simple describe here.
*
*  @author NextLabs::kim
*/


/** precompile header and resource header files */
#include "StdAfx.h"
/** current class declare header files */
#include "common_tools.h"
/** C system header files */

/** C++ system header files */

/** Platform header files */
#include <Sddl.h>
#include <sal.h>
/** Third part library header files */
/** boost */

/** Other project header files */

/** Current project header files */
#include "nlofficerep_only_debug.h"
#include "PreLoadDll.h"

void GetFQDN(_In_z_ LPCWSTR hostname, _Out_z_cap_(nSize) LPWSTR fqdn, _In_ int nSize)
{
    char szHostName[1001] = {0};
    WideCharToMultiByte(CP_ACP, WC_COMPOSITECHECK, hostname, (int)wcslen(hostname), szHostName, 1000, NULL, NULL);

    hostent* hostinfo;
    hostinfo = gethostbyname(szHostName);
    if(hostinfo && hostinfo->h_name)
    {
        MultiByteToWideChar(CP_ACP, MB_PRECOMPOSED, hostinfo->h_name, (int)strlen(hostinfo->h_name), fqdn, nSize);
    }
    else
    {
        wcsncpy_s(fqdn, nSize, hostname, _TRUNCATE);
    }
}

void GetUserInfo(_Out_z_cap_(nSize) LPWSTR wzSid, _In_ int nSize, _Inout_z_cap_(UserNameLen) LPWSTR UserName, _In_ int UserNameLen)
{
    HANDLE hTokenHandle = NULL;

    if(!OpenThreadToken(GetCurrentThread(), TOKEN_QUERY, TRUE, &hTokenHandle))
    {
        if(GetLastError() == ERROR_NO_TOKEN)
        {
            if(!OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hTokenHandle ))
            {
                goto _exit;
            }
        }
        else
        {
            goto _exit;
        }
    }

    // Get SID
    UCHAR   InfoBuffer[512] = { 0 };
    DWORD   cbInfoBuffer = 512;
    LPTSTR  StringSid = NULL;
    WCHAR   uname[64] = {0}; DWORD unamelen = 63;
    WCHAR   dname[64] = {0}; DWORD dnamelen = 63;
    WCHAR   fqdnname[MAX_PATH+1] = { 0 };
    SID_NAME_USE snu = SidTypeUnknown;

    if(!GetTokenInformation(hTokenHandle, TokenUser, InfoBuffer, cbInfoBuffer, &cbInfoBuffer))
    {
        goto _exit;
    }
    if(ConvertSidToStringSid(((PTOKEN_USER)InfoBuffer)->User.Sid, &StringSid))
    {
        wcsncpy_s(wzSid, nSize, StringSid, _TRUNCATE);
        if(StringSid)
        {
            LocalFree(StringSid);
        }
    }
    if(LookupAccountSid(NULL, ((PTOKEN_USER)InfoBuffer)->User.Sid, uname, &unamelen, dname, &dnamelen, &snu))
    {
        char  szHostname[MAX_PATH+1]; memset(szHostname, 0, sizeof(szHostname));
        WCHAR wzHostname[MAX_PATH+1]; memset(wzHostname, 0, sizeof(wzHostname));
        gethostname(szHostname, MAX_PATH);
        if(0 != szHostname[0])
        {
            MultiByteToWideChar(CP_ACP, MB_PRECOMPOSED, szHostname, -1, wzHostname, MAX_PATH);

            GetFQDN(wzHostname, fqdnname, MAX_PATH);

            wcsncat_s(UserName, UserNameLen, fqdnname, _TRUNCATE);
            wcsncat_s(UserName, UserNameLen, L"\\", _TRUNCATE); 
            wcsncat_s(UserName, UserNameLen, uname, _TRUNCATE);
        }
    }

_exit:
    if(NULL!=hTokenHandle)
    { 
        CloseHandle(hTokenHandle);
        hTokenHandle=NULL;
    }
}

std::wstring RegReadStringValue(HKEY hRootKey, const wchar_t* wszPath, const wchar_t* wszValueName)
{
	std::wstring wstrValue;
	HKEY hSubKey = NULL;
	LSTATUS lstatus = RegOpenKeyExW(hRootKey, wszPath, 0, KEY_QUERY_VALUE, &hSubKey);
	if ((lstatus==ERROR_SUCCESS) && (hSubKey!=NULL))
	{
		DWORD dwType = REG_NONE;
		DWORD cbData = 0;
		lstatus = RegQueryValueExW(hSubKey, wszValueName, 0, &dwType, NULL, &cbData);
		if ((lstatus==ERROR_SUCCESS) && (dwType == REG_SZ) && (cbData>0) )
		{
			BYTE* pData = new BYTE[cbData];
			lstatus = RegQueryValueExW(hSubKey, wszValueName, 0, &dwType, pData, &cbData);
			if (lstatus==ERROR_SUCCESS)
			{
			   wstrValue = (wchar_t*)pData;
			}
			delete[] pData;
			pData = NULL;
		}
		RegCloseKey(hSubKey);
	}
	return wstrValue;
}

std::wstring GetNewestJREPath()
{
	//check  JAVA 9 path.
	const std::wstring wstrJRE9RootPath = L"SOFTWARE\\JavaSoft\\JRE";
	std::wstring java9Version = RegReadStringValue(HKEY_LOCAL_MACHINE, wstrJRE9RootPath.c_str(), L"CurrentVersion");
	if (!java9Version.empty())
	{
		NLPrintLogW(TRUE, L"GetNewestJREPath get java9 version:%s\n", java9Version.c_str());

		std::wstring wstrJRE9SubPath = wstrJRE9RootPath + L"\\" + java9Version;
		std::wstring javaHome = RegReadStringValue(HKEY_LOCAL_MACHINE, wstrJRE9SubPath.c_str(), L"JavaHome");
		if (!javaHome.empty())
		{
			NLPrintLogW(TRUE, L"GetNewestJREPath get java9 Home:%s\n", javaHome.c_str());
			return javaHome;
		}
	}

	//check java8/7 path
	const std::wstring wstrJRE8RootPath = L"SOFTWARE\\JavaSoft\\Java Runtime Environment";
	std::wstring java8Version = RegReadStringValue(HKEY_LOCAL_MACHINE, wstrJRE8RootPath.c_str(), L"CurrentVersion");
	if (!java8Version.empty())
	{
		NLPrintLogW(TRUE, L"GetNewestJREPath get java8 version:%s\n", java8Version.c_str());

		std::wstring wstrJRE8SubPath = wstrJRE8RootPath + L"\\" + java8Version;
		std::wstring javaHome = RegReadStringValue(HKEY_LOCAL_MACHINE, wstrJRE8SubPath.c_str(), L"JavaHome");
		if (!javaHome.empty())
		{
			NLPrintLogW(TRUE, L"GetNewestJREPath get java8 Home:%s\n", javaHome.c_str());
			return javaHome;
		}
	}

	//
	NLPrintLogW(TRUE, L"GetNewestJREPath jre may be not installed.\n");
	return L"";
}

std::wstring GetNewestJVMFilePath()
{
	std::wstring wstrJavaHome = GetNewestJREPath();
	if (!wstrJavaHome.empty())
	{
		std::wstring wstrJVM = wstrJavaHome + L"\\bin\\server\\jvm.dll";
		NLPrintLogW(TRUE, L"GetNewestJVMFilePath:%s", wstrJVM.c_str() );
		return wstrJVM;
	}

	return L"";
}

wstring ConnectVectorToString(_In_ const vector<wstring>& kvecString, _In_ const wstring& kstrSeparator)
{
	wstring wstrOut = L"";
	for (vector<wstring>::const_iterator kitrItem = kvecString.begin(); kitrItem != kvecString.end(); ++kitrItem)
	{
		wstrOut += kitrItem->c_str() + kstrSeparator;
	}
	return wstrOut;
}

vector<wstring> SplitString(_In_ const wstring& kwstrSource, _In_ const wstring& kwstrSeparator, _In_ const bool kbRemoveEmptyItem)
{
	vector<wstring> vecOutSnippets;
	if (kwstrSeparator.empty())
	{
		vecOutSnippets.push_back(kwstrSource);
	}
	else
	{

		const size_t kstSourceLen = kwstrSource.length();
		const size_t kstSepLen = kwstrSeparator.length();

		for (int nPos = 0; nPos < kstSourceLen; )
		{
			int nSepPos = kwstrSource.find(kwstrSeparator, nPos);
			if (0 > nSepPos)
			{
				// The last one, save and break
				vecOutSnippets.push_back(kwstrSource.substr(nPos, kstSourceLen - nPos));
				break;
			}
			else
			{
				if (nPos == nSepPos)
				{
					// Start with separator, jump to the next.
					if (!kbRemoveEmptyItem)
					{
						vecOutSnippets.push_back(L"");
					}
				}
				else
				{
					// Find one, save and continue to find the next one, nSepPos always >= nPos
					vecOutSnippets.push_back(kwstrSource.substr(nPos, nSepPos - nPos));
				}
				nPos = nSepPos + kstSepLen;
			}
		}
	}
	return vecOutSnippets;
}


bool IsSameString(_In_ const wstring& kwstrFirst, _In_ const wstring& kwstrSecond, _In_ const bool kbIgnoreCase)
{
	int nCmpResult = 0;
	if (kbIgnoreCase)
	{
		nCmpResult = wcsicmp(kwstrFirst.c_str(), kwstrSecond.c_str());
	}
	else
	{
		nCmpResult = wcscmp(kwstrFirst.c_str(), kwstrSecond.c_str());
	}
	return (0 == nCmpResult);
}

bool IsContainsInVec(_In_ const wstring& kstrIn, _In_ const vector<wstring>& vecIn, _In_ const bool kbIgnoreCase)
{
	bool bFind = false;
	for (vector<wstring>::const_iterator kitrIn = vecIn.begin(); kitrIn != vecIn.end(); ++kitrIn)
	{
		if (IsSameString(kstrIn, (*kitrIn), kbIgnoreCase))
		{
			bFind = true;
			break;
		}
		else
		{
			continue;
		}
	}
	return bFind;
}

bool IsFirstVecContainsInSencondVec(_In_ const vector<wstring>& vecFirstTagValue, _In_ const vector<wstring>& vecSecondTagValue, _In_ const bool kbIgnoreCase)
{
	bool bContains = true; /**< if the first vector is empty, return true, contains in the second one and do not care the second one is empty or not */

	bool bFindInSendVec = false;
	for (vector<wstring>::const_iterator kitrFirst = vecFirstTagValue.begin(); kitrFirst != vecFirstTagValue.end(); ++kitrFirst)
	{
		bFindInSendVec = IsContainsInVec((*kitrFirst), vecSecondTagValue, kbIgnoreCase);
		if (!bFindInSendVec)
		{
			bContains = false;
			break;
		}
	}
	return bContains;
}

void PreLoadTagLibrary()
{

#ifdef _WIN64

		static const wchar_t* gPreLoadDlls64[] = {
			{ L"zlibwapi.dll" },
			{ L"celog.dll" },
			{ L"celog2.dll" },
			{ L"libtiff.dll" },
			{ L"PoDoFoLib.dll" },
			{ L"pdflib.dll" },
			{ L"nl_sysenc_lib.dll" }
		};

		PreLoadDll gpreLoadDLLs(gPreLoadDlls64, sizeof(gPreLoadDlls64) / sizeof(LPCWSTR));

#else 

		static const wchar_t* gPreLoadDlls32[] = {
			{ L"zlib1.dll" },
			{ L"freetype6.dll" },
			{ L"celog32.dll" },
			{ L"celog232.dll" },
			{ L"libtiff.dll" },
			{ L"PoDoFoLib.dll" },
			{ L"pdflib32.dll" },
			{ L"nl_sysenc_lib.dll" }
		};

		PreLoadDll gpreLoadDLLs(gPreLoadDlls32, sizeof(gPreLoadDlls32) / sizeof(LPCWSTR));

#endif

}