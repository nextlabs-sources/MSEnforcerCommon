#ifndef CONNECTION_H
#define CONNECTION_H

#include "IQueryCloudAZ.h"
#include "PolicyResult.h"
#include "Obligation.h"

#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <mutex>

#include "NXLHttpClient.h"


namespace pt = boost::property_tree;

class CloudAZConnection
{
public:
	CloudAZConnection(const std::string& strBaseUrl, const std::string& strPort);

public:
	QueryStatus CheckSingleResource(const IPolicyRequest* ceRequest, IPolicyResult** pcResult);
	QueryStatus CheckMultiResource(const IPolicyRequest** pcRequest, int nRequestCount, IPolicyResult** pcResult);
	void Reset();
private:
	//https://isocpp.org/wiki/faq/pointers-to-members#macro-for-ptr-to-memfn
	#define CALL_MEMBER_FN(ptrObject,ptrToMember)  ((ptrObject)->*(ptrToMember))
	//https://isocpp.org/wiki/faq/pointers-to-members#typedef-for-ptr-to-memfn
	typedef void(CloudAZConnection::*ConstructCategoryToJsonMemFn)(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);

	std::string CreateRequestBody(const IPolicyRequest* ceRequest);
	void ConstructSubjectToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);
	void ConstructActionToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);
	void ConstructAppInfoToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);
	void ConstructHostInfoToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);

	/** @param to The Resource Dimension */
	void ConstructResourceToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode, bool to);
#ifdef _RESOURCE_COMPONENT_DEFINED
	void ConstructResourceToJson(pt::ptree& refTreeNode, const ResourceComponent * pResource, const std::string& resourceDimension); //, bool to = false
#endif

	void ConstructResourceToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);
	void ConstructSourceToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);
	void ConstructTargetToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);

	void ConstructEnvToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode);

	std::string CreateMultiRequestBody(const IPolicyRequest** ceRequest, int nRequestCount);
	std::string ConstructMultiActionJson(const IPolicyRequest* pRequest, pt::ptree& refTreeAction);
	std::string ConstructMultiResourceJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayResource);
	std::string ConstructMultiSubjectToJson(const IPolicyRequest* pRequest, pt::ptree& ptArraySubject);
	std::string ConstructMultiHostInfoToJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayCategory);
	std::string ConstructMultiAppInfoToJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayCategory);
	std::string ConstructMultiEnvToJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayCategory);

	std::string CreateIDForMultiRequest(const char* szPrefix, size_t nID);

	const pt::ptree* GetExistTreeNode(const pt::ptree& ptTree, const char* AttrID, const char* szValue);

	void AddCEAttributeToJson(const IAttributes* pAttr, const std::string& AttrPrefix, pt::ptree& refArrayTree);

	std::string AttributeTypeTostring(CEAttributeType ceAttributeType);

	void ParseObligation(const pt::ptree& ptObligation, Obligation* pOb);

	QueryStatus ParseSinglePolicyResult(const pt::ptree& ptResponse, PolicyResult* pcResult);
	QueryStatus ParsePolicyResult(const pt::ptree&  ptResult, PolicyResult* pcResult);

	PolicyEnforcement StringToPolicyResult(const std::string& strRestResponse);

	QueryStatus GetErrorStatus(const pt::ptree& jsonValue);

private:
	//web::http::client::http_client m_httpClient;
	NXLHttpClient m_nxlHttpClient;

    std::mutex m_mutex;
	//HANDLE m_hMutextClient;


};


#endif

