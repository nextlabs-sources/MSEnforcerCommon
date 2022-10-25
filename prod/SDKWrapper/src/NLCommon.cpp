#include "stdafx.h"
#include "NLCommon.h"

#ifdef _FOR_RMX
#include "GlobalConfig.h"
#endif 

NLCommon::NLCommon()
{
}

NLCommon::~NLCommon()
{
}

wstring NLCommon::GetInstallDir(EPathType ept)
{
    wstring wstrRegPath = L"";
    wstring wstrRegKey = L"";
    switch (ept)   
    {
    case epPC:
        {
            wstrRegPath = L"Software\\NextLabs\\Compliant Enterprise\\Policy Controller";
            wstrRegKey = L"PolicyControllerDir";
            break;
        }
    case epSPE:
        {
            wstrRegPath = L"Software\\NextLabs\\Compliant Enterprise\\SharePoint Enforcer";
            wstrRegKey = L"InstallDir";
            break;
        }
    case epCommon:
		{
#ifdef _FOR_RMX
		return g_Config.GetCommonLibPath();
#else
            wstrRegPath = L"Software\\NextLabs\\CommonLibraries";
            wstrRegKey = L"InstallDir";		
            break;
#endif 

		}
    default:
        break;
    }

    wstring wstrDir=L"";
    HKEY  hKey = NULL;
    long lRetValue = RegOpenKeyEx(HKEY_LOCAL_MACHINE, wstrRegPath.c_str(), 0, KEY_READ, &hKey);

    if (lRetValue == ERROR_SUCCESS && hKey != NULL)
    {
        WCHAR wzInstallDir[MAX_PATH] = { 0 };
        DWORD dwType = REG_SZ;
        DWORD dwLength = MAX_PATH - 1;
        lRetValue = RegQueryValueEx(hKey, wstrRegKey.c_str(), 0, &dwType, (BYTE*)wzInstallDir, &dwLength);
        if (lRetValue == ERROR_SUCCESS && wcslen(wzInstallDir) > 0)
        {
            wstrDir = wzInstallDir;
        }
    }
    return wstrDir;

}

string NLCommon::ConvertwstringTostring(const wstring& wstr)
{
    int Size = WideCharToMultiByte(CP_ACP, 0, wstr.c_str(), -1, NULL, 0, NULL, NULL);
    if (0 == Size)
    {
        return string();
    }

    char* str = new char[Size]();
    WideCharToMultiByte(CP_ACP, 0, wstr.c_str(), -1, str, Size, NULL, NULL);
    string retstr = str;
    delete[]str;

    return retstr;
}

jstring NLCommon::Wstr2Jstr(JNIEnv *pEnv, const wstring wstrSrc)
{
	const wchar_t* pstrSrc = wstrSrc.c_str();
    size_t nSrcLen = wcslen(pstrSrc);

    jchar* pJchdest = new jchar[nSrcLen + 1];
    memset(pJchdest, 0, sizeof(jchar)*(nSrcLen + 1));
    for (int i = 0; i<nSrcLen; i++)
	{
        memcpy(&pJchdest[i], &pstrSrc[i], 2);
	}
    jstring jstrDst = pEnv->NewString(pJchdest, (long)nSrcLen);

    delete[] pJchdest;
    return jstrDst;
}

wstring NLCommon::Jstr2Wstr(JNIEnv *pEnv, const jstring jstrInput)
{
	wstring wstrRet = L"";

    const jchar *pjchRaw = pEnv->GetStringChars(jstrInput, 0);
    jsize jnLen = pEnv->GetStringLength(jstrInput);

    wstrRet.assign(pjchRaw, pjchRaw + jnLen);

    pEnv->ReleaseStringChars(jstrInput, pjchRaw);

    return wstrRet;
}


BOOL NLCommon::SafeArrayStringToVector(SAFEARRAY* safeArray, std::vector<std::wstring>& vecData)
{
	if (safeArray==NULL)
	{
		return FALSE;
	}

	//check type
	VARTYPE vt = VT_NULL;
	SafeArrayGetVartype(safeArray, &vt);
	if (vt!=VT_BSTR)
	{
		return FALSE;
	}

	//get data
	long lLBound = 0, lUBound = 0;
	BSTR* pBstr = NULL;
	HRESULT hr = SafeArrayAccessData(safeArray, (void**)&pBstr);
	if (hr!=S_OK)
	{
		return FALSE;
	}
	SafeArrayGetLBound(safeArray, 1, &lLBound);
	SafeArrayGetUBound(safeArray, 1, &lUBound);

	for (long lIndex = lLBound; lIndex <= lUBound; lIndex++)
	{
		vecData.push_back(pBstr[lIndex]);
	}
	SafeArrayUnaccessData(safeArray);

	return TRUE;
}