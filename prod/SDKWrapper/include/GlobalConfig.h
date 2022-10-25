#pragma once
#include "resource.h"       // main symbols
#include "resattrmgr.h"
#include "SDKWrapper.h"
#include <string>


class Config
{
public:
	std::wstring& GetCommonLibPath();
	void SetCommonLibPath(const wchar_t* wszPath);

private:
	std::wstring m_wstrComLibPath;
};

extern Config g_Config;


class ATL_NO_VTABLE GlobalConfig :
	public CComObjectRootEx<CComMultiThreadModel>,
	public CComCoClass<GlobalConfig, &CLSID_GlobalConfig>,
	public IDispatchImpl<IGlobalConfig, &IID_IGlobalConfig, &LIBID_SDKWrapperLib, /*wMajor =*/ 1, /*wMinor =*/ 0>
{
public:
	GlobalConfig()
	{
	}

	DECLARE_REGISTRY_RESOURCEID(IDR_GLOBALCONFIG)


	BEGIN_COM_MAP(GlobalConfig)
		COM_INTERFACE_ENTRY(IGlobalConfig)
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

protected:
	STDMETHOD(SetCommonLibPath)(BSTR bstrPath);

};

OBJECT_ENTRY_AUTO(__uuidof(GlobalConfig), GlobalConfig)