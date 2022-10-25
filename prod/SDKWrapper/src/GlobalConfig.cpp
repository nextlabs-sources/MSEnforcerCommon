#include "stdafx.h"
#include <string>
#include "comutil.h"
#include "GlobalConfig.h"
#include "nlofficerep_only_debug.h"
#include "common_tools.h"

Config g_Config;

void Config::SetCommonLibPath(const wchar_t* wszPath)
{
	m_wstrComLibPath = wszPath;
}

std::wstring& Config::GetCommonLibPath()
{
	if (m_wstrComLibPath.empty())
	{
		NLPrintLogW(g_kbOutputDebugLog, L"GlobalConfig::GetCommonLibPath return empty. Library path is not set.");
	}
    return m_wstrComLibPath;
}


STDMETHODIMP GlobalConfig::SetCommonLibPath(BSTR bstrPath)
{
	if (bstrPath==NULL)
	{
		NLPrintLogW(g_kbOutputDebugLog, L"GlobalConfig::SetCommonLibPath failed, path is null");
		return E_FAIL;
	}

	g_Config.SetCommonLibPath(bstrPath);
	NLPrintLogW(g_kbOutputDebugLog, L"GlobalConfig::SetCommonLibPath:%s", bstrPath);
	return S_OK;
}