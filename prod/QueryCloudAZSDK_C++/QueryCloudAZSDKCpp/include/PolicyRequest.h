#ifndef POLICY_REQUEST_H
#define POLICY_REQUEST_H

#include "IQueryCloudAZ.h"
#include <iostream>

class PolicyRequest : public IPolicyRequest
{
public:
	PolicyRequest();
	virtual ~PolicyRequest();  //must be virtual

	//base method
protected:
	void SetUserInfo(const char* szSID, const char* szName, IAttributes* IAttr);
	const char* GetUserSID() const { return m_strUserSID.c_str(); }
	const char* GetCEUserName() const { return m_strUserName.c_str(); }
	const IAttributes* GetUserAttr() const { return m_UserAttr; }

	void SetAction(const char* szAction) { m_strAction = szAction; }
	const char* GetAction() const { return m_strAction.c_str(); }

	void SetAppInfo(const char* szAppName, const char* szPath, const char* Url, IAttributes* IAttr);
	const char* GetAppName() const { return m_strAppName.c_str(); }
	const char* GetAppPath() const { return m_strAppPath.c_str(); }
	const char* GetAppUrl() const { return m_strAppUrl.c_str(); }
	const IAttributes* GetAppAttr() const { return m_AppAttr;  }

	void SetHostInfo(const char* szHostName, const char* szIP, IAttributes* pHostAttr);
	const char* GetHostName() const { return m_strHostName.c_str(); }
	const char* GetHostIP() const { return m_strHostIP.c_str(); }
	const IAttributes* GetHostAttr() const { return m_HostAttr; }

	//void SetSource(const char* szSourceName, const char* szSourceType, IAttributes* pSourceAttr);
	//const char* GetSourceName() const { return m_strSourceName.c_str(); }
	//const char* GetSourceType() const { return m_strSourceType.c_str(); }
	//const IAttributes* GetSourceAttr() const { return m_SourceAttr; }

	//void SetTarget(const char* szTargetName, const char* szTargetType, IAttributes* pTargetAttr);
	//const char* GetTargetName() const { return m_strTargetName.c_str(); }
	//const char* GetTargetType() const { return m_strTargetType.c_str(); }
	//const IAttributes* GetTargetAttr() const { return m_TargetAttr; }

	void SetSource(const char* szSourceName, const char* szSourceType, IAttributes* pSourceAttr);
	void SetTarget(const char* szTargetName, const char* szTargetType, IAttributes* pTargetAttr);

#ifdef _RESOURCE_COMPONENT_DEFINED
	const char* GetSourceName() const { return m_SourceResource.name.c_str(); }
	const char* GetSourceType() const { return m_SourceResource.type.c_str(); }
	const IAttributes* GetSourceAttr() const { return m_SourceResource.attribtues; }
	const ResourceComponent* GetSourceResource() const { return &m_SourceResource; }

	const char* GetTargetName() const { return m_TargetResource.name.c_str(); }
	const char* GetTargetType() const { return m_TargetResource.type.c_str(); }
	const IAttributes* GetTargetAttr() const { return m_TargetResource.attribtues; }
	const ResourceComponent* GetTargetResource() const { return &m_TargetResource; }
#else
	const char* GetSourceName() const { return m_strSourceName.c_str(); }
	const char* GetSourceType() const { return m_strSourceType.c_str(); }
	const IAttributes* GetSourceAttr() const { return m_SourceAttr; }

	const char* GetTargetName() const { return m_strTargetName.c_str(); }
	const char* GetTargetType() const { return m_strTargetType.c_str(); }
	const IAttributes* GetTargetAttr() const { return m_TargetAttr; }
#endif // _RESOURCE_COMPONENT_DEFINED

	void SetEnvironmentAttr(IAttributes* pEnvAttr) { m_EnvAttr = pEnvAttr; }
	const IAttributes* GetEnvironmentAttr() const {	return m_EnvAttr;}

protected:
	std::string m_strAction;

	std::string m_strUserSID;
	std::string m_strUserName;
	IAttributes* m_UserAttr;

	std::string m_strAppName;
	std::string m_strAppPath;
	std::string m_strAppUrl;
	IAttributes* m_AppAttr;

	std::string m_strHostName;
	std::string m_strHostIP;
	IAttributes* m_HostAttr;

#ifdef _RESOURCE_COMPONENT_DEFINED
	ResourceComponent m_SourceResource, m_TargetResource;
#else
	std::string m_strSourceName;
	std::string m_strSourceType;
	IAttributes* m_SourceAttr;

	std::string m_strTargetName;
	std::string m_strTargetType;
	IAttributes* m_TargetAttr;
#endif // _RESOURCE_COMPONENT_DEFINED

	IAttributes* m_EnvAttr;
};



#endif