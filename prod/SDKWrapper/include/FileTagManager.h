// FileTagManager.h : Declaration of the CFileTagManager

#pragma once
#include "resource.h"       // main symbols
#include "resattrmgr.h"
#include "SDKWrapper.h"
#include <map>
using namespace ATL;
using namespace std;

// CFileTagManager

class ATL_NO_VTABLE CFileTagManager :
	public CComObjectRootEx<CComMultiThreadModel>,
	public CComCoClass<CFileTagManager, &CLSID_FileTagManager>,
	public IDispatchImpl<IFileTagManager, &IID_IFileTagManager, &LIBID_SDKWrapperLib, /*wMajor =*/ 1, /*wMinor =*/ 0>
{
public:
    CFileTagManager();
    ~CFileTagManager();

DECLARE_REGISTRY_RESOURCEID(IDR_FILETAGMANAGER)

BEGIN_COM_MAP(CFileTagManager)
	COM_INTERFACE_ENTRY(IFileTagManager)
	COM_INTERFACE_ENTRY(IDispatch)
END_COM_MAP()

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}

	void FinalRelease()
	{
	}
public:
    STDMETHOD(GetTagsCount)(BSTR bstrFilePath, LONG* lCount, LONG* lResult);
    STDMETHOD(GetTagByIndex)(BSTR bstrFilePath, LONG lIndex, BSTR* btsrTagName, BSTR* btsrTagValue, LONG* lResult);
    STDMETHOD(SetUpdateTag)(BSTR bstrTagName, BSTR bstrTagValue, LONG* lResult);
    STDMETHOD(ClearUpdateSetTags)(LONG* lResult);
    STDMETHOD(UpdateFileTag)(BSTR bstrFilePath, BOOL bOverWrite, LONG* lResult);
	STDMETHOD(UpdateFileTagWithTagMethod)(BSTR bstrFilePath, BOOL bOverWrite, LONG*lResult);
private:
    BOOL InitResattr();
    void RemoveAllTags(const WCHAR* wzFilePath);
private:
    map<wstring, wstring> m_mSetTags;
    ResourceAttributeManager *m_pMgr;
    ResourceAttributes* m_pAttrs;
    wstring m_filePath;
    CComAutoCriticalSection m_csMap; // Lock for "m_mSetTags".
    CComAutoCriticalSection m_csAttr; // Lock for "m_pAttrs".
};

OBJECT_ENTRY_AUTO(__uuidof(FileTagManager), CFileTagManager)
