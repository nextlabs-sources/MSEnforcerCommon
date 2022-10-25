// NLRightsManager.h : Declaration of the CNLRightsManager

#pragma once
#include "resource.h"       // main symbols
#include <jni.h>
#include <string>
#include <vector>
#include  "NLCppJavaCommon.h"

#include "SDKWrapper.h"

//#if defined(_WIN32_WCE) && !defined(_CE_DCOM) && !defined(_CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA)
//#error "Single-threaded COM objects are not properly supported on Windows CE platform, such as the Windows Mobile platforms that do not include full DCOM support. Define _CE_ALLOW_SINGLE_THREADED_OBJECTS_IN_MTA to force ATL to support creating single-thread COM object's and allow use of it's single-threaded COM object implementations. The threading model in your rgs file was set to 'Free' as that is the only threading model supported in non DCOM Windows CE platforms."
//#endif

//using namespace ATL;

// CNLRightsManager
class ATL_NO_VTABLE CNLRightsManager :
    public CComObjectRootEx<CComMultiThreadModel>,
	public CComCoClass<CNLRightsManager, &CLSID_NLRightsManager>,
	public IDispatchImpl<INLRightsManager, &IID_INLRightsManager, &LIBID_SDKWrapperLib, /*wMajor =*/ 1, /*wMinor =*/ 0>
{
public:
	CNLRightsManager()
	{
		m_RmsObj = NULL;
	}

DECLARE_REGISTRY_RESOURCEID(IDR_NLRIGHTSMANAGER)

BEGIN_COM_MAP(CNLRightsManager)
	COM_INTERFACE_ENTRY(INLRightsManager)
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
	STDMETHOD(NLEncryptTokenGroup)(int tokenGroupType, BSTR bstrInPath, BSTR bstrOutPath, 
		SAFEARRAY * arrayTagKey, SAFEARRAY * arrayTagValue, LONG* lResult);
	STDMETHOD(NLEncryptProject)(BSTR projectName, BSTR bstrInPath, BSTR bstrOutPath, 
		   SAFEARRAY * arrayTagKey,  SAFEARRAY * arrayTagValue, LONG* lResult);
    STDMETHOD(NLDecrypt)(BSTR bstrInPath, BSTR bstrOutPath, LONG* lResult);
    STDMETHOD(NLGetTagsCount)(BSTR bstrInPath, LONG* lCount, LONG* lResult);
    STDMETHOD(NLReadTags)(BSTR bstrInPath, LONG lIndex, BSTR* bstrName, BSTR* bstrValue, LONG* lResult);
    STDMETHOD(NLUpdateTags)(BSTR bstrInPath, LONG* lResult);
    STDMETHOD(NLIsNxl)(BSTR bstrInPath, BOOL* bNxl, LONG* lResult);
	STDMETHOD(InitializeClass)(BSTR bstrRouteUrl, BSTR bstrAppkey, int appID);
private:
    wstring GetPCInstallDir();
    wstring GetCommonDir();
    BOOL IfVectorContains(const vector<wstring>& vecName, const vector<wstring>& vecValue, wstring wstrName, wstring wstrValue);
private:
    vector<wstring> m_vecGetName; //Get tags name vector
    vector<wstring> m_vecGetValue; //Get tags value vector
    wstring m_wstrFilePath; // Record file path for tags.
    CComAutoCriticalSection m_csTag; // Lock for setting tag.

	RightManagerPara m_rmPara;
	jobject m_RmsObj;

public:

};

OBJECT_ENTRY_AUTO(__uuidof(NLRightsManager), CNLRightsManager)
