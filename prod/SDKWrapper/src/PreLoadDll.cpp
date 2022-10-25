#include "stdafx.h"
#include "PreLoadDll.h"
#include "NLCommon.h"



//////////////////////////////////////////////////////////////////////////

PreLoadDll::PreLoadDll(const wchar_t* dlls[], int nCount)
{
	std::wstring strCommonPath = NLCommon::GetInstallDir(epCommon);
#ifdef _WIN64
	strCommonPath += L"bin64\\";
#else
	strCommonPath += L"bin32\\";
#endif 
	int iIndex = 0;
	for (iIndex = 0; iIndex < nCount; ++iIndex)
	{
		std::wstring dllPath = strCommonPath + dlls[iIndex];
		hinstDLLs[iIndex] = ::LoadLibraryW(dllPath.c_str());

		wchar_t wStr[MAX_PATH] = { 0 };
		swprintf(wStr, MAX_PATH, L"%s been Loaded %s\r\n", dllPath.c_str(), (NULL == hinstDLLs[iIndex]) ? L"failed" : L"success" );
		OutputDebugStringW(wStr);
	}
}

PreLoadDll::~PreLoadDll()
{
}

