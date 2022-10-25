#include "PolicyRequest.h"


PolicyRequest::PolicyRequest()
{
	m_UserAttr = NULL;
	m_AppAttr = NULL;
	m_HostAttr = NULL;
	//m_SourceAttr = NULL;
	m_EnvAttr = NULL;
}

PolicyRequest::~PolicyRequest()
{

}

void PolicyRequest::SetUserInfo(const char* szSID, const char* szName, IAttributes* IAttr)
{
	m_strUserSID = szSID;
	if(szName) m_strUserName = szName;
	m_UserAttr = IAttr;
}

void PolicyRequest::SetAppInfo(const char* szAppName, const char* szPath, const char* Url, IAttributes* IAttr)
{
	m_strAppName = szAppName;
	m_strAppPath = szPath;
	m_strAppUrl = Url;
	m_AppAttr = IAttr;
}

void PolicyRequest::SetHostInfo(const char* szHostName, const char* szIP, IAttributes* pHostAttr)
{
	m_strHostName = szHostName;
	m_strHostIP = szIP;
	m_HostAttr = pHostAttr;
}

void PolicyRequest::SetSource(const char* szSourceName, const char* szSourceType, IAttributes* pSourceAttr)
{
#ifdef _RESOURCE_COMPONENT_DEFINED
	//m_SourceResource.name = szSourceName;
	//m_SourceResource.type = szSourceType;
	//m_SourceResource.attribtues = pSourceAttr;
	m_SourceResource.set(szSourceName, szSourceType, pSourceAttr);
#else
	m_strSourceName = szSourceName;
	m_strSourceType = szSourceType;
	m_SourceAttr = pSourceAttr;
#endif // _RESOURCE_COMPONENT_DEFINED
}

void PolicyRequest::SetTarget(const char* szTargetName, const char* szTargetType, IAttributes* pTargetAttr)
{

#ifdef _RESOURCE_COMPONENT_DEFINED
	//m_TargetResource.name = szTargetName;
	//m_TargetResource.type = szTargetType;
	//m_TargetResource.attribtues = pTargetAttr;
	m_SourceResource.set(szTargetName, szTargetType, pTargetAttr);
#else
	m_strTargetName = szTargetName;
	m_strTargetType = szTargetType;
	m_TargetAttr = pTargetAttr;
#endif // _RESOURCE_COMPONENT_DEFINED
}