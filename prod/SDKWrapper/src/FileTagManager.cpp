// FileTagManager.cpp : Implementation of CFileTagManager

#include "stdafx.h"
#include "FileTagManager.h"
#include <string>
#include "comutil.h"
#include "../platform/cesdk.h"
#include "nlofficerep_only_debug.h"
#include "common_tools.h"
#include "NLCommon.h"

typedef int (*CreateAttributeManagerType)(ResourceAttributeManager **mgr);
typedef int (*AllocAttributesType)(ResourceAttributes **attrs);
typedef int (*ReadResourceAttributesWType)(ResourceAttributeManager *mgr, const WCHAR *filename, ResourceAttributes *attrs);
typedef int (*GetAttributeCountType)(const ResourceAttributes *attrs);
typedef void (*FreeAttributesType)(ResourceAttributes *attrs);
typedef void (*CloseAttributeManagerType)(ResourceAttributeManager *mgr);
typedef void (*AddAttributeWType)(ResourceAttributes *attrs, const WCHAR *name, const WCHAR *value);
typedef const WCHAR *(*GetAttributeNameType)(const ResourceAttributes *attrs, int index);
typedef const WCHAR * (*GetAttributeValueType)(const ResourceAttributes *attrs, int index);
typedef int (*WriteResourceAttributesWType)(ResourceAttributeManager *mgr, const WCHAR *filename, ResourceAttributes *attrs);
typedef int (*RemoveResourceAttributesWType)(ResourceAttributeManager *mgr, const WCHAR *filename, ResourceAttributes *attrs);

static CreateAttributeManagerType lfCreateAttributeManager = NULL;
static AllocAttributesType lfAllocAttributes = NULL;
static ReadResourceAttributesWType lfReadResourceAttributesW = NULL;
static GetAttributeCountType lfGetAttributeCount = NULL;
static FreeAttributesType lfFreeAttributes = NULL;
static CloseAttributeManagerType lfCloseAttributeManager = NULL;
static AddAttributeWType lfAddAttributeW = NULL;
static GetAttributeNameType lfGetAttributeName = NULL;
static GetAttributeValueType lfGetAttributeValue = NULL;
static WriteResourceAttributesWType lfWriteResourceAttributesW = NULL;
static RemoveResourceAttributesWType lfRemoveResourceAttributesW = NULL;

CFileTagManager::CFileTagManager()
{
    m_pMgr = NULL;
    m_pAttrs = NULL;
    BOOL bInit = InitResattr();
    if(bInit)
    {
        lfCreateAttributeManager(&m_pMgr);
    }
}

CFileTagManager::~CFileTagManager()
{
	if (m_pMgr != NULL)
	{
		lfCloseAttributeManager(m_pMgr);
		m_pMgr = NULL;
	}
    if (m_pAttrs)
	{
		lfFreeAttributes(m_pAttrs);
		m_pAttrs = NULL;
	}	
}

// CFileTagManager
BOOL CFileTagManager::InitResattr()
{
    static BOOL bInit = FALSE;
	if(!bInit)
	{
		//preload tag dll
		PreLoadTagLibrary();

		//load resattrlib.dll and resattrmgr.dll

		std::wstring strCommonPath = NLCommon::GetInstallDir(epCommon);
		if (!strCommonPath.empty())
		{
#ifdef _WIN64
			/* let's use module from common bin first, otherwise, it will
			cause bug of 55774, conflict with SPE's module heap.
			*/
			std::wstring strtemp = L"C:\\Program Files\\NextLabs\\Common\\";
			std::wstring strLib = strtemp + L"bin64\\resattrlib.dll";
			std::wstring strMgr = strtemp + L"bin64\\resattrmgr.dll";
			if (!PathFileExistsW(strLib.c_str()))
			{
				strLib = strCommonPath + L"bin64\\resattrlib.dll";
			}
			if (!PathFileExistsW(strMgr.c_str()))
			{
				strMgr = strCommonPath + L"bin64\\resattrmgr.dll";
			}
#else
			std::wstring strLib = strCommonPath + L"bin32\\resattrlib32.dll";
			std::wstring strMgr = strCommonPath + L"bin32\\resattrmgr32.dll";
#endif 

			HMODULE hModLib = (HMODULE)LoadLibraryW(strLib.c_str());
			HMODULE hModMgr = (HMODULE)LoadLibraryW(strMgr.c_str());

			if( hModLib != NULL && hModMgr != NULL)
			{
			    lfCreateAttributeManager = (CreateAttributeManagerType)GetProcAddress(hModMgr, "CreateAttributeManager");
			    lfAllocAttributes = (AllocAttributesType)GetProcAddress(hModLib, "AllocAttributes");
			    lfReadResourceAttributesW = (ReadResourceAttributesWType)GetProcAddress(hModMgr, "ReadResourceAttributesW");
			    lfGetAttributeCount = (GetAttributeCountType)GetProcAddress(hModLib, "GetAttributeCount");
			    lfFreeAttributes = (FreeAttributesType)GetProcAddress(hModLib, "FreeAttributes");
			    lfCloseAttributeManager = (CloseAttributeManagerType)GetProcAddress(hModMgr, "CloseAttributeManager");
			    lfAddAttributeW = (AddAttributeWType)GetProcAddress(hModLib, "AddAttributeW");
			    lfGetAttributeName = (GetAttributeNameType)GetProcAddress(hModLib, "GetAttributeName");
			    lfGetAttributeValue = (GetAttributeValueType)GetProcAddress(hModLib, "GetAttributeValue");
			    lfWriteResourceAttributesW = (WriteResourceAttributesWType)GetProcAddress(hModMgr, "WriteResourceAttributesW");
			    lfRemoveResourceAttributesW = (RemoveResourceAttributesWType)GetProcAddress(hModMgr, "RemoveResourceAttributesW");

			    if( lfCreateAttributeManager != NULL && lfAllocAttributes != NULL && lfReadResourceAttributesW != NULL 
                    && lfGetAttributeCount != NULL && lfFreeAttributes != NULL && lfCloseAttributeManager != NULL 
                    && lfAddAttributeW != NULL &&lfGetAttributeName != NULL && lfGetAttributeValue != NULL 
                    && lfWriteResourceAttributesW != NULL && lfRemoveResourceAttributesW != NULL)
			    {
                    bInit = TRUE;
			    }
            }
		}
	}
    NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager InitResattr status is [%d].", bInit);
    
    return bInit;
}

STDMETHODIMP CFileTagManager::GetTagsCount(BSTR bstrFilePath, LONG* lCount, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrFilePath == NULL || bstrFilePath[0] == L'\0')
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager GetTagsCount: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    else
    {
        m_filePath = bstrFilePath;
		{
			CComCritSecLock<CComAutoCriticalSection> lock(m_csAttr, true);
			if(m_pAttrs != NULL)	// make sure only use once each time, bad code
			{
				lfFreeAttributes(m_pAttrs); // Free old tags in attrs object.
				m_pAttrs = NULL;
			}
			if(m_pAttrs == NULL)	lfAllocAttributes(&m_pAttrs); // init new attrs object.
		}

	    if(m_pAttrs != NULL && m_pMgr != NULL)
	    {
            _bstr_t bstrtFilePath = bstrFilePath;
            WCHAR* wzFilePath = bstrtFilePath;
            BOOL bRet = FALSE;
            int attrcount = 0;
            {
                CComCritSecLock<CComAutoCriticalSection> lock(m_csAttr, true);
		        bRet = lfReadResourceAttributesW(m_pMgr, wzFilePath, m_pAttrs);
                attrcount = lfGetAttributeCount(m_pAttrs);
                *lCount = attrcount;
            }
            if(bRet)
            {
                hr = S_OK;
                *lResult = CE_RESULT_SUCCESS;
            }
            NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager GetTagsCount: bstrFilePath:[%s], TagsCount:[%d], bRet:[%d] \n", bstrFilePath, attrcount, bRet);
	    }
    }

    return hr;
}


STDMETHODIMP CFileTagManager::GetTagByIndex(BSTR bstrFilePath, LONG lIndex, BSTR* btsrTagName, BSTR* btsrTagValue, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrFilePath == NULL || bstrFilePath[0] == L'\0' || btsrTagName == NULL || btsrTagValue == NULL)
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager GetTagByIndex: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    else
    {
       if(m_pAttrs != NULL && m_filePath == bstrFilePath)
       {
           WCHAR* wzName = NULL;
           WCHAR* wzValue = NULL;
           {
               CComCritSecLock<CComAutoCriticalSection> lock(m_csAttr, true);
               wzName = (WCHAR*)lfGetAttributeName(m_pAttrs, lIndex);
		       wzValue = (WCHAR*)lfGetAttributeValue(m_pAttrs, lIndex);
           }
           *btsrTagName = SysAllocString(wzName);
           *btsrTagValue = SysAllocString(wzValue);
           hr = S_OK;
           *lResult = CE_RESULT_SUCCESS;
           NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager GetTagByIndex: bstrFilePath:[%s], lIndex:[%d], bstrTagName:[%s], bstrTagValue:[%s] \n", bstrFilePath, lIndex, wzName, wzValue);
       }
    }

    return hr;
}


STDMETHODIMP CFileTagManager::SetUpdateTag(BSTR bstrTagName, BSTR bstrTagValue, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrTagName == NULL || bstrTagValue == NULL || bstrTagName[0] == L'\0') // Value maybe "".
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager SetUpdateTag: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    else
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager SetUpdateTag: bstrTagName:[%s], bstrTagValue:[%s] \n", bstrTagName, bstrTagValue);
        {
            CComCritSecLock<CComAutoCriticalSection> lock(m_csMap, true);
            m_mSetTags[bstrTagName] = bstrTagValue;
        }
        hr = S_OK;
        *lResult = CE_RESULT_SUCCESS;
    }
    return hr;
}


STDMETHODIMP CFileTagManager::ClearUpdateSetTags(LONG* lResult)
{
    NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager ClearUpdateSetTags \n");

    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    else
    {
        // lock for clearing tag.
        CComCritSecLock<CComAutoCriticalSection> lock(m_csMap, true);
        m_mSetTags.clear();
    }
    *lResult = CE_RESULT_SUCCESS;
    return S_OK;
}

void CFileTagManager::RemoveAllTags(const WCHAR* wzFilePath)
{
    ResourceAttributes* pAttrs = NULL;
    lfAllocAttributes(&pAttrs);
    if(pAttrs != NULL && m_pMgr != NULL)
    {
        lfReadResourceAttributesW(m_pMgr, wzFilePath, pAttrs);
        lfRemoveResourceAttributesW(m_pMgr, wzFilePath, pAttrs);
    }
    if(pAttrs != NULL)
    {
        lfFreeAttributes(pAttrs);
    }
}


//bOverWrite only overwrite tag for the same name. 
//different to UpdateFileTag that will remove all exist tag in overwrite mode.
STDMETHODIMP CFileTagManager::UpdateFileTagWithTagMethod(BSTR bstrFilePath, BOOL bOverWrite, LONG*lResult)
{
	HRESULT hr = E_FAIL;
	if (lResult == NULL)
	{
		return E_INVALIDARG;
	}
	*lResult = CE_RESULT_GENERAL_FAILED;
	if (bstrFilePath == NULL || bstrFilePath[0] == L'\0')
	{
		NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager UpdateFileTagWithTagMethod: parameter is invalid.");
		*lResult = CE_RESULT_INVALID_PARAMS;
		return E_INVALIDARG;
	}

	NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager UpdateFileTagWithTagMethod: bstrFilePath:[%s] \n", bstrFilePath);
	_bstr_t bstrtFilePath = bstrFilePath;
	WCHAR* wzFilePath = bstrtFilePath;

	ResourceAttributes* pAttrs = NULL;
	lfAllocAttributes(&pAttrs);
	if ((pAttrs != NULL) && (m_pMgr != NULL))
	{
		//added new tag
		map<wstring, wstring>::iterator mIter = m_mSetTags.begin();
		for (; mIter != m_mSetTags.end(); ++mIter)
		{
			lfAddAttributeW(pAttrs, (mIter->first).c_str(), (mIter->second).c_str());
		}

		if (!bOverWrite)
		{
			//in append mode ,need added exist tag
			ResourceAttributes *currentAttributes = NULL;;
			(lfAllocAttributes)(&currentAttributes);
			if (currentAttributes != NULL)
			{
				(lfReadResourceAttributesW)(m_pMgr, wzFilePath, currentAttributes);

				int currentSize = (lfGetAttributeCount)(currentAttributes);
				const WCHAR *value = L"";
				const WCHAR* name = L"";
				for (int i = 0; i < currentSize; ++i)
				{
					name = (*lfGetAttributeName)(currentAttributes, i);
					value = (*lfGetAttributeValue)(currentAttributes, i);
					if (name != NULL && value != NULL)
					{
						(lfAddAttributeW)(pAttrs, name, value);
					}
				}

			}

			//free
			lfFreeAttributes(currentAttributes);
			currentAttributes = NULL;
		}

		//write tag
		BOOL bRet = FALSE;
		{
			CComCritSecLock<CComAutoCriticalSection> lock(m_csAttr, true);
			bRet = lfWriteResourceAttributesW(m_pMgr, wzFilePath, pAttrs);
		}

		NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager UpdateFileTagWithTagMethod: bstrFilePath:[%s] bRet:[%d] \n", wzFilePath, bRet);
		if (bRet)
		{
			hr = S_OK;
			*lResult = CE_RESULT_SUCCESS;
		}

		//free
		lfFreeAttributes(pAttrs);
		pAttrs = NULL;
	}

	return hr;

}

STDMETHODIMP CFileTagManager::UpdateFileTag(BSTR bstrFilePath, BOOL bOverWrite, LONG* lResult)
{
    HRESULT hr = E_FAIL;
    if(lResult == NULL)
    {
        return E_INVALIDARG;
    }
    *lResult = CE_RESULT_GENERAL_FAILED;
    if (bstrFilePath == NULL || bstrFilePath[0] == L'\0')
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager UpdateFileTag: parameter is invalid.");
        *lResult = CE_RESULT_INVALID_PARAMS;
        return E_INVALIDARG;
    }
    else
    {
        NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager UpdateFileTag: bstrFilePath:[%s] \n", bstrFilePath);
        _bstr_t bstrtFilePath = bstrFilePath;
        WCHAR* wzFilePath = bstrtFilePath;
        {
            ResourceAttributes* pAttrs = NULL;
            lfAllocAttributes(&pAttrs);
            if(pAttrs != NULL)
            {
                if(bOverWrite)
                {
                    RemoveAllTags(wzFilePath);
                }
                map<wstring, wstring>::iterator mIter = m_mSetTags.begin();
                for(; mIter != m_mSetTags.end(); ++mIter)
                {
                    lfAddAttributeW(pAttrs, (mIter->first).c_str(), (mIter->second).c_str());
                }
                BOOL bRet = FALSE;
                if(m_pMgr != NULL)
                {
                    bRet = lfWriteResourceAttributesW(m_pMgr, wzFilePath, pAttrs);
                }
                NLPrintLogW(g_kbOutputDebugLog, L"CFileTagManager UpdateFileTag: bstrFilePath:[%s] bRet:[%d] \n", bstrFilePath, bRet);
                if(bRet)
                {
                    hr = S_OK;
                    *lResult = CE_RESULT_SUCCESS;
                }
	            lfFreeAttributes(pAttrs);
            }
        }
    }
    return hr;
}
