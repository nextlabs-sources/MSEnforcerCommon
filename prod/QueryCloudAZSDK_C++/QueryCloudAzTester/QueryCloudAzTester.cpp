// QueryCloudAzTester.cpp : Defines the entry point for the console application.

#define USE_STATIC_SDK 0
#define MULTI_THREAD 1

#include <windows.h>

#if USE_STATIC_SDK
#include "NxlCERequest.hpp"
#include "NxlJPCRestRequest.hpp"
#include <NxlEnforceModule.h>

using namespace std;
using namespace NxlQueryCloudAzSdk;

#else

#include "../QueryCloudAZSDKCpp/include/QueryCloudAZExport.h"
#endif
#include <boost/thread.hpp>

#if 1
//std::string strJPCHost = "https://sfjpc1.crm.nextlabs.solutions";
std::string strJPCHost = "https://emjpc.crm.nextlabs.solutions";
std::string strJPCPort = "443";
//std::string strOAuthHost = "https://sfcc1.crm.nextlabs.solutions";
//std::string strOAuthHost = "https://sfjpc1.crm.nextlabs.solutions";
//std::string strOAuthHost = strJPCHost;
std::string strOAuthHost = "https://emcc.crm.nextlabs.solutions";
std::string strOAuthPort = "443";
std::string strClientId = "apiclient";
std::string strClientSecure = "123next!";
#elif 0
std::string strJPCHost = "http://cc85-jpc.qapf1.qalab01.nextlabs.com";
std::string strJPCPort = "58080";
std::string strOAuthHost = "https://cc85-console.qapf1.qalab01.nextlabs.com";
std::string strOAuthPort = "443";
std::string strClientId = "apiclient";
std::string strClientSecure = "123blue!";
#elif 0
std::string strJPCHost = "http://cc87-jpc.qapf1.qalab01.nextlabs.com";
std::string strJPCPort = "58080";
//std::string strOAuthHost = "https://cc87-console.qapf1.qalab01.nextlabs.com";
std::string strOAuthHost = "https://cc87-cc.qapf1.qalab01.nextlabs.com";
std::string strOAuthPort = "443";
std::string strClientId = "apiclient";
std::string strClientSecure = "123blue!";


#elif 0
std::string strJPCHost = "http://pc-rhel7.qapf1.qalab01.nextlabs.com";
std::string strJPCPort = "58080";
std::string strOAuthHost = "https://rhel7-cc.qapf1.qalab01.nextlabs.com";
std::string strOAuthPort = "443";
std::string strClientId = "apiclient";
std::string strClientSecure = "123blue!";
#elif 1
std::string strJPCHost = "https://edrm-jpc.azure.cloudaz.net";
std::string strJPCPort = "443";
std::string strOAuthHost = "https://edrm-cc.azure.cloudaz.net";
std::string strOAuthPort = "443";
std::string strClientId = "apiclient";
std::string strClientSecure = "ItisBlue888!";

#elif 1
std::string strJPCHost = "https://10.0.10.5";
std::string strJPCPort = "443";
std::string strOAuthHost = "https://edrm-cc.azure.cloudaz.net";
std::string strOAuthPort = "443";
std::string strClientId = "apiclient";
std::string strClientSecure = "ItisBlue888!";

#endif

#if USE_STATIC_SDK
CERequest CreateCEReqest(string strAction, string userId, string userEmail,
	string resoureName, CEAttres& userAttrs, CEAttres& resourceAttrs)
{
	CERequest obRequest;
	obRequest.SetAction(strAction);

	obRequest.SetUser(userId, userEmail, userAttrs);
	obRequest.SetSource(resoureName, "fso", resourceAttrs);
	obRequest.SetNameAttributes("dont-care-acceptable", "yes", NxlQueryCloudAzSdk::XACML_string);
	CEAttres emptyAttr;
	obRequest.SetApp("Salesforce", "", "", emptyAttr);
	obRequest.SetNoiseLevel(CE_NOISE_LEVEL_USER_ACTION);

	return obRequest;
}



void QueryWithWinnet()
{
	CEAttres ceAttr;
	ceAttr.addAttribute("number", "123", NxlQueryCloudAzSdk::XACML_string);
	CERequest ceRequest = CreateCEReqest("OPEN", "userId1", "user1@test.com", "c:/mytt/test", ceAttr, ceAttr);
	CERequest ceRequest1 = CreateCEReqest("OPEN", "userId2", "user2@test.com", "c:/mytt/test1", ceAttr, ceAttr);
	CEEnforcer ceEnforcer(strJPCHost, strJPCPort, strOAuthHost, strOAuthPort, strClientId, strClientSecure);
	NxlQueryCloudAzSdk::QueryStatus status = ceEnforcer.RefreshToken();

	
#if MULTI_THREAD
	for (int i = 0; i < 40; i++)
	{
		boost::thread t([&, i]() {

			list<CEObligation> listObligation;
			PolicyResult pcResult;

			// CheckSingleResource;
			DWORD dwBegin = GetTickCount();
			NxlQueryCloudAzSdk::QueryStatus bLink = ceEnforcer.CheckSingleResource(ceRequest, pcResult, listObligation, true);
			DWORD dwEnd = GetTickCount();


			//if (bLink == NxlQueryCloudAzSdk::QS_S_OK)
			{
				printf("CheckSingleResource Result:%d, tick:%d\n", i, dwEnd - dwBegin);
			}
		});
	}
#else
	for (int i = 0; i < 40; i++)
	{
		list<CEObligation> listObligation;
		PolicyResult pcResult;

		// CheckSingleResource;
		DWORD dwBegin = GetTickCount();
		NxlQueryCloudAzSdk::QueryStatus bLink = ceEnforcer.CheckSingleResource(ceRequest, pcResult, listObligation, true);
		DWORD dwEnd = GetTickCount();


		//if (bLink == NxlQueryCloudAzSdk::QS_S_OK)
		{
			printf("CheckSingleResource single thread Result:%d, tick:%d\n", i, dwEnd - dwBegin);
		}
	}
#endif

	getchar();


#if 1
	list<CERequest> listRequest;
	listRequest.push_back(ceRequest);
	listRequest.push_back(ceRequest1);
	list<PolicyResult> listResult;
	list<list<CEObligation>> listObs;
	// CheckMultipleResources;
	bLink = ceEnforcer.CheckMultipleResources(listRequest, listResult, listObs, true);
	if (bLink == NxlQueryCloudAzSdk::QS_S_OK)
	{
		printf("CheckMultipleResources Success\n");
		list<PolicyResult>::iterator resultIt = listResult.begin();
		for (; resultIt != listResult.end(); resultIt++)
		{
			printf("CheckMultipleResources Result:%d\n", (int)(*resultIt));
		}
	}
	string myTT;
#endif 
}

#else 
void QueryWithCppRest()
{
#if 0
	if (!QueryCloudAZInit("http://azure-dev-cc", "58080", "https://azure-dev-cc", "443", "apiclient", "123blue!", 10))
	{
	printf("QueryCloudAZInit failed.\n");
	return ;
	}
#else
	if (!QueryCloudAZInit(strJPCHost.c_str(), strJPCPort.c_str(), strOAuthHost.c_str(), strOAuthPort.c_str(), strClientId.c_str(), strClientSecure.c_str(), 1))
	{
		printf("QueryCloudAZInit failed.\n");
		return ;
	}
#endif 

	IPolicyRequest* pRequest = CreatePolicyRequest();

	//action 必需
	pRequest->SetAction("OUTBOUND");

	//user attr  必需
	pRequest->SetUserInfo("S-1-5-21-2018228179-1005617703-974104760-1202", "1gfgfgfdg1jimmy.carter@qapf1.qalab01.nextlabs.com", NULL);
//	pRequest->SetUserInfo("S-1-5-21-2018228179-1005617703-974104760-244607", "jimmy.carter@qapf1.qalab01.nextlabs.com", NULL);
//	pRequest->SetUserInfo("", "nxl2rls@domain.com", NULL);

	// Set source info, this is mandatory
	IAttributes* pSourceAttr = CreateCEAttr();
	pSourceAttr->AddAttribute("sqlserver", "sqltest002.database.windows.net", XACML_string);
	pSourceAttr->AddAttribute("database", "CDCDB", XACML_string);
	pSourceAttr->AddAttribute("table", "dbo.Sales", XACML_string);
	//pSourceAttr->AddAttribute("pep_decision", "deny", XACML_string);

	pRequest->SetSource("C:/Temp/SQLProxy_testmodel.txt", "ee", pSourceAttr);

	//app info 非必需
	pRequest->SetAppInfo("SQLProxy", "apppath_ee", "app url", NULL);

	//host info 必需
	pRequest->SetHostInfo("HostName", "10.23.60.102", NULL);

	//set Env   非必需
#if 0
	IAttributes* pEnvAttr = CreateCEAttr();
	pEnvAttr->AddAttribute("dont-care-acceptable", "yes", XACML_string);
	//pEnvAttr->AddAttribute("error-result-acceptable", "yes", XACML_string);
	pRequest->SetEnvironmentAttr(pEnvAttr);
#endif 

#if 0
	IPolicyRequest* pRequest2 = CreatePolicyRequest();
	{
		//action 必需
		pRequest2->SetAction("VIEW");

		//user attr  必需
		pRequest2->SetUserInfo("S-1-5-21-310440588-250036847-580389505-500", "jimmy.carter@qapf1.qalab01.nextlabs.com", NULL);

		// Set source info, this is mandatory
		IAttributes* pSourceAttr = CreateCEAttr();
		pSourceAttr->AddAttribute("sqlserver", "sqltest002.database.windows.net", XACML_string);
		pSourceAttr->AddAttribute("database", "CDCDB", XACML_string);
		pSourceAttr->AddAttribute("table", "Account03", XACML_string);

		pRequest2->SetSource("C:/Temp/SQLProxy2.txt", "ee", pSourceAttr);

		//app info 非必需
		pRequest2->SetAppInfo("SQLProxy", "app path", "app url", NULL);

		//host info 必需
		IAttributes* pHostAttr = CreateCEAttr();
		pHostAttr->AddAttribute("name", "this is host name", XACML_string);

		pRequest2->SetHostInfo("hostname", "10.23.60.172", pHostAttr);

		//set Env   非必需
		IAttributes* pEnvAttr = CreateCEAttr();
		pEnvAttr->AddAttribute("dont-care-acceptable", "yes", XACML_string);
		pRequest2->SetEnvironmentAttr(pEnvAttr);
	}
#endif 

	const IPolicyRequest* request[] = { pRequest };
	IPolicyResult* result[sizeof(request) / sizeof(request[0])] = { 0 };
	DWORD dwBegin = GetTickCount();
	while (true)
	{
		IPolicyResult* pResult = NULL;
		//DWORD dwBegin = GetTickCount();
		QueryStatus qs0 = CheckSingleResource(pRequest, &pResult);
		//DWORD dwEnd = GetTickCount();
		//DWORD dw = dwEnd - dwBegin;
		//QueryStatus qs1 = CheckMultiResource(&request[0], sizeof(request)/sizeof(request[0]), result);
		break;
		Sleep(10 * 1000);
	}
	
	//QueryStatus qs1 = CheckMultiResource(&request[0], sizeof(request)/sizeof(request[0]), result);
	DWORD dwEnd = GetTickCount();
	printf("TickCount:%d\n", dwEnd - dwBegin);
	 return ;

	//query policy
#if MULTI_THREAD
	for (int i = 0; i < 20; i++)
	{
		boost::thread t([pRequest, i]() {

			IPolicyResult* pResult = NULL;
			QueryStatus qs;


			DWORD dwBegin = GetTickCount();
			qs = CheckSingleResource(pRequest, &pResult);
			DWORD dwEnd = GetTickCount();

			FreePolicyResult(pResult);
			pResult = NULL;

			printf("index:%d, tick:%d, status=%d, begin:%u\n", i, dwEnd - dwBegin, qs, dwBegin);


		});
	}

	Sleep(10000);
	printf("\r\n\n\n");
	DWORD dwBeginAll = GetTickCount();
	std::list<boost::thread*> lstThread;
	for (int i = 0; i < 20; i++)
	{
		boost::thread* t = new boost::thread([pRequest, i]() {

			IPolicyResult* pResult = NULL;
			QueryStatus qs;

			//for (int i=0; i<4; i++)
			{
				DWORD dwBegin = GetTickCount();
				qs = CheckSingleResource(pRequest, &pResult);
				DWORD dwEnd = GetTickCount();

				FreePolicyResult(pResult);
				pResult = NULL;

				printf("index:%d, tick:%d, status=%d, begin:%u\n", i, dwEnd - dwBegin, qs, dwBegin);
			}
			

             });

		lstThread.push_back(t);
      }

	for (auto t= lstThread.begin(); t!=lstThread.end(); t++)
	{
		(*t)->join();
	}

	DWORD dwEndAll = GetTickCount();
	printf("Whole tick:%d\n", dwEndAll - dwBeginAll);
#else
	for (int i = 0; i < 20; i++)
	{
		IPolicyResult* pResult = NULL;
		QueryStatus qs;

		char szApp[100];
		sprintf(szApp, "App%d", i);
		pRequest->SetAppInfo(szApp, "", "", NULL);

		DWORD dwBegin = GetTickCount();
		qs = CheckSingleResource(pRequest, &pResult);
		DWORD dwEnd = GetTickCount();

		FreePolicyResult(pResult);
		pResult = NULL;

		printf("single thread index:%d, tick:%d, Begin=%u\n", i, dwEnd - dwBegin, dwBegin);

	}

	Sleep(1000);
	printf("\n\n\n");

	DWORD dwBeginAll = GetTickCount();
	for (int i = 0; i < 20; i++)
	{
		IPolicyResult* pResult = NULL;
		QueryStatus qs;

		DWORD dwBegin = GetTickCount();
		qs = CheckSingleResource(pRequest, &pResult);
		DWORD dwEnd = GetTickCount();

		FreePolicyResult(pResult);
		pResult = NULL;

		printf("single thread index:%d, tick:%d, Begin=%u\n", i, dwEnd - dwBegin, dwBegin);

	}
	DWORD dwEndAll = GetTickCount();
	printf("While tick:%d\n", dwEndAll - dwBeginAll);
#endif 
	

	//getchar();


	return ;

#if 0
	if (qs == QS_S_OK)
	{
		if (pResult && pResult->GetQueryStatus() == QS_S_OK)
		{
			//print result
			printf("Enforcement:%d\n", pResult->GetEnforcement());
			for (size_t iOb = 0; iOb < pResult->ObligationCount(); iOb++)
			{
				const IObligation* pOb = pResult->GetObligationByIndex(iOb);
				printf("\nObligation:%s\n", pOb->GetObligationName());

				const IAttributes* pAttr = pOb->GetAttributes();
				for (size_t iAttr = 0; iAttr < pAttr->Count(); iAttr++)
				{
					const char* pName;
					const char* pValue;
					CEAttributeType type;
					pAttr->GetAttrByIndex(iAttr, &pName, &pValue, &type);

					printf("%s:%s\n", pName, pValue);
				}

			}
		}
	}


	//free
	FreePolicyRequest(pRequest);
	pRequest = NULL;

	FreePolicyResult(pResult);
	pResult = NULL;

	FreeCEAttr(pSourceAttr);
	pSourceAttr = NULL;
	FreeCEAttr(pEnvAttr);
	pEnvAttr = NULL;
#endif 
}

#endif 
int main()
{
#if USE_STATIC_SDK
	QueryWithWinnet();
#else 

	QueryWithCppRest();
#endif 

	return 1;
}

