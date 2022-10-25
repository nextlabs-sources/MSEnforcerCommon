#ifndef QUERY_CLOUDAZ_INTERFACE_H
#define QUERY_CLOUDAZ_INTERFACE_H

#include <list>

// The query status from PC. 
enum QueryStatus
{
	QS_S_OK,
	QS_E_Failed,
	QS_E_Unauthorized,
	QS_E_BadRequest,
	QS_E_ServiceUnavailable,
	QS_E_MissAttributes,
	QS_E_InternalError,
	QS_E_TooManyRequest,
	QS_E_DisConnect,
};

enum PolicyEnforcement
{
	Deny=0,
	Allow=1,
	DontCare=2
};

// The attribute type pass to PC.
enum CEAttributeType
{
	XACML_string,
	XACML_bool,
	XACML_int,
	XACML_Double,
	XACML_Time,
	XACML_Date,
	XACML_DateTime,
	XACML_DayTimeDuration,
	XACML_YearMonthDuration,
	XACML_AnyURI,
	XACML_HexBinary,
	XACML_Base64Binary,
	XACML_Rfc822Name,
	XACML_X500Name,
	XACML_IpAddress,
	XACML_DnsName,
	XACML_XpathExpression,
	XACML_ArrInt,
	XACML_ArrStr
};

class IAttributes
{
public:
	virtual ~IAttributes() {};
	virtual void AddAttribute(const char* szName, const char* szValue, CEAttributeType attrType) = 0;
	virtual size_t Count() const = 0;
	virtual bool GetAttrByIndex(size_t nIndex, const char** ppName, const char** ppValue, CEAttributeType* pAttrType) const = 0;
};

//class ResourceComponent
//{
//public:
//	// the value of the built-in attribute urn:oasis:names:tc:xacml:1.0:resource:resource-id
//	std::string name;
//	// the value of the built-in attribute urn:nextlabs:names:evalsvc:1.0:resource:resource-type
//	std::string type;
//	// custom attributes: urn:nextlabs:names:evalsvc:1.0:resource:your_attribute
//	IAttributes* attribtues;
//
//	ResourceComponent()
//		: attribtues(NULL)
//	{
//	}
//	void set(const char* szName, const char* szType, IAttributes* pAttr)
//	{
//		name = szName;
//		name = szType;
//		attribtues = pAttr;
//	}
//};
//#define _RESOURCE_COMPONENT_DEFINED

class IPolicyRequest
{
public:
	virtual ~IPolicyRequest() {};
	//action
	virtual void SetAction(const char* szAction)=0;
	virtual const char* GetAction() const = 0;

	//user info
	virtual void SetUserInfo(const char* szSID, const char* szName,IAttributes* IAttr)=0;
	virtual const char* GetUserSID() const = 0;
	virtual const char* GetCEUserName() const = 0;
	virtual const IAttributes* GetUserAttr() const = 0;

	//app info
	virtual void SetAppInfo(const char* szAppName, const char* szPath, const char* Url, IAttributes* IAttr) = 0;
	virtual const char* GetAppName() const = 0;
	virtual const char* GetAppPath() const = 0;
	virtual const char* GetAppUrl() const = 0;
	virtual const IAttributes* GetAppAttr() const = 0;

	//host info
	virtual void SetHostInfo(const char* szHostName, const char* szIP, IAttributes* pHostAttr) = 0;
	virtual const char* GetHostName() const = 0;
	virtual const char* GetHostIP() const = 0;
	virtual const IAttributes* GetHostAttr() const = 0;

	//source info
	virtual void SetSource(const char* szSourceName, const char* szSourceType, IAttributes* pSourceAttr) = 0;
	virtual const char* GetSourceName() const = 0;
	virtual const char* GetSourceType() const = 0;
	virtual const IAttributes* GetSourceAttr() const = 0;

	//target info
	virtual void SetTarget(const char* szTargetName, const char* szTargetType, IAttributes* pTargetAttr) = 0;
	virtual const char* GetTargetName() const = 0;
	virtual const char* GetTargetType() const = 0;
	virtual const IAttributes* GetTargetAttr() const = 0;

#ifdef _RESOURCE_COMPONENT_DEFINED
	virtual const ResourceComponent* GetSourceResource() const = 0;
	virtual const ResourceComponent* GetTargetResource() const = 0;
#endif

	//set Env attribute
	virtual void SetEnvironmentAttr(IAttributes* pEnvAttr) = 0;
	virtual const IAttributes* GetEnvironmentAttr() const = 0;
};

class IObligation
{
public:
	virtual ~IObligation() {};
	virtual const char* GetObligationName() const = 0;
	virtual const IAttributes* GetAttributes() const  = 0;
};


class IPolicyResult
{
public:
	virtual ~IPolicyResult() {};
	virtual PolicyEnforcement GetEnforcement() const =0;
	virtual QueryStatus GetQueryStatus() const = 0;
	virtual size_t ObligationCount() const = 0;
	virtual const IObligation* GetObligationByIndex(size_t nIndex) const = 0;
};

#endif 
