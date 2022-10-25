// NLRightsManager.cpp : Implementation of CNLRightsManager

#include "stdafx.h"
#include "NLRightsManager.h"
#include "nlofficerep_only_debug.h"
#include "comutil.h"
#include "../platform/cesdk.h"
#include <memory>

BOOL CNLRightsManager::IfVectorContains(const vector<wstring>& vecName, const vector<wstring>& vecValue, wstring wstrName, wstring wstrValue)
{
	BOOL bContain = FALSE;
	size_t iCount = vecName.size();
	for(int i = 0; i < iCount; i++)
	{
		if(vecName[i] == wstrName && vecValue[i] == wstrValue)
		{
			bContain = TRUE;
			break;
		}
	}
	return bContain;
}


STDMETHODIMP CNLRightsManager::NLEncryptProject(BSTR projectName,  BSTR bstrInPath, BSTR bstrOutPath,
	SAFEARRAY * arrayTagKey, SAFEARRAY * arrayTagValue, LONG* lResult)
{
	HRESULT hr = E_FAIL;
	if (lResult == NULL)
	{
		return E_INVALIDARG;
	}
	*lResult = CE_RESULT_GENERAL_FAILED;
	if (bstrInPath == NULL || bstrOutPath == NULL || bstrInPath[0] == L'\0' || bstrOutPath[0] == L'\0')
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLEncryptProject: parameter is invalid.");
		*lResult = CE_RESULT_INVALID_PARAMS;
		return E_INVALIDARG;
	}
	NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
	if (!javaCom.CheckInit())
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLEncryptProject: init javaCom failed.");
		*lResult = CE_RESULT_CONN_FAILED;
		return hr;
	}
	NLPrintLogW(true, L"CNLRightsManager NLEncryptProject: project:[%s], bstrInPath:[%s], bstrOutPath:[%s] \n", 
		projectName, bstrInPath, bstrOutPath);

	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (pJEnv == NULL)
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLEncryptProject return fail for NULL jENV");
		return E_FAIL;
	}

	if (m_RmsObj==NULL)
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLEncryptProject return fail for NULL rms Object");
		return E_FAIL;
	}

	jstring jstrInPath = javaCom.ComposeBstr2JObj(pJEnv, bstrInPath);
	jstring jstrOutPath = javaCom.ComposeBstr2JObj(pJEnv, bstrOutPath);
	jstring jstrProjectName = javaCom.ComposeBstr2JObj(pJEnv, projectName);

	//get tag and convert to jobject
	std::vector<std::wstring> vecTagKey, vecTagValue;
	NLCommon::SafeArrayStringToVector(arrayTagKey, vecTagKey);
	NLCommon::SafeArrayStringToVector(arrayTagValue, vecTagValue);

	jobject joTags = javaCom.ComposeStrVector2JMap(pJEnv, vecTagKey, vecTagValue);

	javaCom.ExecuteJavaAPI(pJEnv, m_RmsObj, rmATEncryptProject, jstrInPath, jstrOutPath, NULL, joTags, NULL,
		m_rmPara.jstrRouterUrl, m_rmPara.nAppID, m_rmPara.jstrAppKey, NULL, jstrProjectName);


	*lResult = CE_RESULT_SUCCESS;
	hr = S_OK;

	return hr;
}

STDMETHODIMP CNLRightsManager::NLEncryptTokenGroup(int tokenGroupType,BSTR bstrInPath,
	BSTR bstrOutPath, SAFEARRAY * arrayTagKey,SAFEARRAY * arrayTagValue, LONG* lResult)
{
	HRESULT hr = E_FAIL;
	if (lResult == NULL)
	{
		return E_INVALIDARG;
	}
	*lResult = CE_RESULT_GENERAL_FAILED;
	if (bstrInPath == NULL || bstrOutPath == NULL || bstrInPath[0] == L'\0' || bstrOutPath[0] == L'\0')
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLEncrypt: parameter is invalid.");
		*lResult = CE_RESULT_INVALID_PARAMS;
		return E_INVALIDARG;
	}
	NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
	if (!javaCom.CheckInit())
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLEncrypt: init javaCom failed.");
		*lResult = CE_RESULT_CONN_FAILED;
		return hr;
	}
	NLPrintLogW(true, L"CNLRightsManager NLEncrypt: bstrInPath:[%s], bstrOutPath:[%s] \n", bstrInPath, bstrOutPath);

	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (pJEnv == NULL)
	{
		return E_FAIL;
	}

	jstring jstrInPath = javaCom.ComposeBstr2JObj(pJEnv, bstrInPath);
	jstring jstrOutPath = javaCom.ComposeBstr2JObj(pJEnv, bstrOutPath);

	//get tag and convert to jobject
	std::vector<std::wstring> vecTagKey, vecTagValue;
	NLCommon::SafeArrayStringToVector(arrayTagKey, vecTagKey);
	NLCommon::SafeArrayStringToVector(arrayTagValue, vecTagValue);
	jobject joTags = javaCom.ComposeStrVector2JMap(pJEnv, vecTagKey, vecTagValue);


	javaCom.ExecuteJavaAPI(pJEnv, m_RmsObj, rmATEncryptTokenGroup, jstrInPath, jstrOutPath, NULL, joTags, NULL,
		m_rmPara.jstrRouterUrl, m_rmPara.nAppID, m_rmPara.jstrAppKey, tokenGroupType, NULL);

	*lResult = CE_RESULT_SUCCESS;
	hr = S_OK;
	return hr;
}

STDMETHODIMP CNLRightsManager::NLDecrypt(BSTR bstrInPath, BSTR bstrOutPath, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrInPath == NULL || bstrOutPath == NULL || bstrInPath[0] == L'\0' || bstrOutPath[0] == L'\0')
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLDecrypt: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
    if (!javaCom.CheckInit())
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLDecrypt: init javaCom failed.");
        *lResult = CE_RESULT_CONN_FAILED;
        return hr;
    }
    NLPrintLogW(true, L"CNLRightsManager NLDecrypt: bstrInPath:[%s], bstrOutPath:[%s] \n", bstrInPath, bstrOutPath);

	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (!pJEnv)
	{
		return E_FAIL;
	}

    jstring jstrInPath = javaCom.ComposeBstr2JObj(pJEnv,bstrInPath);
    jstring jstrOutPath = javaCom.ComposeBstr2JObj(pJEnv,bstrOutPath);
    javaCom.ExecuteJavaAPI(pJEnv,m_RmsObj, rmATUnencrypt, jstrInPath, jstrOutPath, NULL, NULL, NULL,
		NULL, 0, NULL, 0, NULL);

    *lResult = CE_RESULT_SUCCESS;
    hr = S_OK;
    return hr;
}

STDMETHODIMP CNLRightsManager::NLGetTagsCount(BSTR bstrInPath, LONG* lCount, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }    
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrInPath == NULL || bstrInPath[0] == L'\0')
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLGetTagsCount: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
    if (!javaCom.CheckInit())
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLGetTagsCount: init javaCom failed.");
        *lResult = CE_RESULT_CONN_FAILED;
        return hr;
    }
    NLPrintLogW(true, L"CNLRightsManager NLGetTagsCount: bstrInPath:[%s] \n", bstrInPath);
    m_vecGetName.clear();
    m_vecGetValue.clear();
    m_wstrFilePath = bstrInPath;

	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (!pJEnv)
	{
		return E_FAIL;
	}

    jstring jstrInPath = javaCom.ComposeBstr2JObj(pJEnv,bstrInPath);
    jobject jmapTags = javaCom.ExecuteJavaAPI(pJEnv, m_RmsObj, rmATReadTag, jstrInPath, NULL, NULL, NULL, NULL,
		NULL, 0, NULL, 0, NULL);
    javaCom.ComposeJMap2StrVector(pJEnv, jmapTags, m_vecGetName, m_vecGetValue);
    *lCount = (LONG)m_vecGetName.size();

    *lResult = CE_RESULT_SUCCESS;
    hr = S_OK;
    return hr;
}

STDMETHODIMP CNLRightsManager::NLReadTags(BSTR bstrInPath, LONG lIndex, BSTR* bstrName, BSTR* bstrValue, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrInPath == NULL || bstrInPath[0] == L'\0' || m_wstrFilePath != bstrInPath)
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLReadTags: parameter bstrInPath is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
    if (!javaCom.CheckInit())
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLReadTags: init javaCom failed.");
        *lResult = CE_RESULT_CONN_FAILED;
        return hr;
    }
    NLPrintLogW(true, L"CNLRightsManager NLReadTags: bstrInPath:[%s], index:[%d] \n", bstrInPath, lIndex);
    if (lIndex < m_vecGetName.size())
    {
		_bstr_t bstrtName = m_vecGetName[lIndex].c_str();
		WCHAR* wzName = bstrtName;
		_bstr_t bstrtValue = m_vecGetValue[lIndex].c_str();
		WCHAR* wzValue = bstrtValue;
        *bstrName = SysAllocString(wzName);
        *bstrValue = SysAllocString(wzValue);
        *lResult = CE_RESULT_SUCCESS;
        hr = S_OK;
    }
    else
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLReadTags: index is larger than tag vector length.\n");
        *lResult = CE_RESULT_INVALID_PARAMS;
    }

    return hr;
}

STDMETHODIMP CNLRightsManager::NLUpdateTags(BSTR bstrInPath, LONG* lResult)
{
	
    HRESULT hr = E_FAIL;
	/*
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrInPath == NULL || bstrInPath[0] == L'\0')
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLUpdateTags: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
    if (!javaCom.CheckInit())
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLUpdateTags: init javaCom failed.");
        *lResult = CE_RESULT_CONN_FAILED;
        return hr;
    }
    NLPrintLogW(true, L"CNLRightsManager NLUpdateTags: bstrInPath:[%s] \n", bstrInPath);

	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (!pJEnv)
	{
		return E_FAIL;
	}


    jstring jstrInPath = javaCom.ComposeBstr2JObj(pJEnv, bstrInPath);
    jobject jmapTags = javaCom.ComposeStrVector2JMap(pJEnv, m_vecSetName, m_vecSetValue);
    javaCom.ExecuteJavaAPI(pJEnv, m_RmsObj, rmATUpdateTag, jstrInPath, NULL, NULL, jmapTags, NULL,
		NULL, 0, NULL, 0, NULL);
   
    *lResult = CE_RESULT_SUCCESS;
    hr = S_OK;
	*/
    return hr;
}

STDMETHODIMP CNLRightsManager::NLIsNxl(BSTR bstrInPath, BOOL* bNxl, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrInPath == NULL || bstrInPath[0] == L'\0')
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLIsNxl: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
    if (!javaCom.CheckInit())
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CNLRightsManager NLIsNxl: init javaCom failed.");
        *lResult = CE_RESULT_CONN_FAILED;
        return hr;
    }
    NLPrintLogW(true, L"CNLRightsManager NLIsNxl: bstrInPath:[%s] \n", bstrInPath);

	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (!pJEnv)
	{
		return E_FAIL;
	}

    jstring jstrInPath = javaCom.ComposeBstr2JObj(pJEnv,bstrInPath);
    jboolean jboolNxl = (jboolean)javaCom.ExecuteJavaAPI(pJEnv, m_RmsObj, rmATIsNxl, jstrInPath, NULL, NULL, NULL, NULL,
		NULL, 0, NULL, 0, NULL);

    *bNxl = (BOOL)jboolNxl;
    *lResult = CE_RESULT_SUCCESS;
    hr = S_OK;
    return hr;
}


//caller must call this method in single thread status(e.g. process start) first.
//because the NLCppJavaCommon class is not thread safe.
STDMETHODIMP CNLRightsManager::InitializeClass(BSTR bstrRouteUrl, BSTR bstrAppkey, int appID)
{
	HRESULT hr = S_OK;

	//init
	NLCppJavaCommon& javaCom = NLCppJavaCommon::GetInstance();
	bool bInit = javaCom.CheckInit();
	if (!bInit)
	{
		return E_FAIL;
	}
	
	//set config
	JNIEnv* pJEnv = javaCom.GetJavaEnv();
	if (!pJEnv)
	{
		return E_FAIL;
	}
	
	m_rmPara.jstrRouterUrl = javaCom.ComposeBstr2JObj(pJEnv, bstrRouteUrl);
	m_rmPara.jstrAppKey = javaCom.ComposeBstr2JObj(pJEnv, bstrAppkey);
	m_rmPara.nAppID = appID;

	//create object
	m_RmsObj = javaCom.ExecuteJavaAPI(pJEnv, NULL, rmNewRMSObject, NULL, NULL, NULL, NULL,
		NULL, m_rmPara.jstrRouterUrl, m_rmPara.nAppID, m_rmPara.jstrAppKey, 0, NULL);

	return m_RmsObj!=NULL ? S_OK : E_FAIL;	
}


