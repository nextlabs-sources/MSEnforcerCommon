#define QUERYCLOUDAZ_EXPORT

#include "QueryCloudAZExport.h"
#include "QueryCloudAZManager.h"

bool QueryCloudAZInit(const char* wszPCHost, const char* wszPcPort,
					  const char* wszOAuthServiceHost, const char* wszOAuthPort,
	                  const char* wszClientId, const char* wszClientSecret, int nConnectionCount,
	const std::function<int(int lvl, const char* logStr)>& cb/* = default_handler*/)
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->Init(wszPCHost, wszPcPort, wszOAuthServiceHost, wszOAuthPort, wszClientId, wszClientSecret, nConnectionCount, cb);
}


QueryStatus CheckSingleResource(const IPolicyRequest* pcRequest, IPolicyResult** pcResult)
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->CheckSingleResource(pcRequest, pcResult);
}

QueryStatus CheckMultiResource(const IPolicyRequest** pcRequest, int nRequestCount, IPolicyResult** pcResult)
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->CheckMultiResource(pcRequest, nRequestCount, pcResult);
}

IPolicyRequest* CreatePolicyRequest()
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->CreatePolicyRequest();
}

IAttributes* CreateCEAttr()
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->CreateCEAttr();
}

void FreePolicyRequest(IPolicyRequest* pRequest)
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->FreePolicyRequest(pRequest);
}

void FreePolicyResult(IPolicyResult* pResult)
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->FreePolicyResult(pResult);
}

void FreeCEAttr(IAttributes* pAttr)
{
	QueryCloudAZMgr* theMgr = QueryCloudAZMgr::Instance();
	return theMgr->FreeCEAttr(pAttr);
}

