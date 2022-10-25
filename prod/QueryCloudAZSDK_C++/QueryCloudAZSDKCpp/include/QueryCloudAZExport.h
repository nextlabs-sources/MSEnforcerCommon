#ifndef QUERY_CLOUDAZ_EXPORT_H
#define QUERY_CLOUDAZ_EXPORT_H

#ifdef WIN32
#ifdef QUERYCLOUDAZ_EXPORT
#define QUERYCLOUDAZ_API extern "C" __declspec(dllexport)
#else
#define QUERYCLOUDAZ_API extern "C" __declspec(dllimport)
#endif
#else
#define QUERYCLOUDAZ_API extern "C" __attribute__((visibility("default")))
#endif


#include "IQueryCloudAZ.h"
#include <functional>

#define MAX_CONNECTIONS_TO_CLOUDAZ 20
#define MAX_REQUEST_IN_MULTICHECK  100

QUERYCLOUDAZ_API bool QueryCloudAZInit(const char* wszPCHost, const char* wszPcPort,
	                                   const char* wszOAuthServiceHost, const char* wszOAuthPort,
	                                   const char* wszClientId, const char* wszClientSecret,
	                                   int nConnectionCount,
	const std::function<int(int lvl, const char* logStr)>& cb = [](int, const char*) { return 0; });

QUERYCLOUDAZ_API QueryStatus  CheckSingleResource(const IPolicyRequest* pcRequest, IPolicyResult** pcResult);
QUERYCLOUDAZ_API QueryStatus  CheckMultiResource (const IPolicyRequest** pcRequest, int nRequestCount, IPolicyResult** pcResult);


QUERYCLOUDAZ_API IPolicyRequest* CreatePolicyRequest();
QUERYCLOUDAZ_API IAttributes* CreateCEAttr();

QUERYCLOUDAZ_API void  FreePolicyRequest(IPolicyRequest* pRequest);
QUERYCLOUDAZ_API void  FreePolicyResult(IPolicyResult* pResult);
QUERYCLOUDAZ_API void  FreeCEAttr(IAttributes* pAttr);


#endif

