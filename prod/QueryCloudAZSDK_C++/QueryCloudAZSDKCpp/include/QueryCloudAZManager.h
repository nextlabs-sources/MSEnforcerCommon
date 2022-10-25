#ifndef QUERY_CLOUDAZ_MANAGER_H
#define QUERY_CLOUDAZ_MANAGER_H

#include "QueryCloudAZManager.h"
#include "ConnectionPool.h"
#include <boost/thread/shared_mutex.hpp>
#include <boost/thread/mutex.hpp>
#include <chrono> // std::chrono::steady_clock; std::chrono::duration

enum emLogLevel
{
    log_trace = 0,
    log_debug,
    log_info,
    log_warning,
    log_error,
    log_fatal
};


class QueryCloudAZMgr
{
protected:
	QueryCloudAZMgr();
	QueryCloudAZMgr(const QueryCloudAZMgr&) {}


public:
	static QueryCloudAZMgr* Instance()
	{
		static QueryCloudAZMgr* theMgr = NULL;
		if (theMgr==NULL)
		{
			theMgr = new QueryCloudAZMgr();
		}
		return theMgr;
	}

	//get member
public:
	const std::string& GetPCHost() { return m_strPCHost; }
	const std::string& GetPCPort() { return m_strPCPort; }
	const std::string& GetOAuthHost() { return m_strOAuthHost ; }
	const std::string& GetOAuthPort() { return m_strOAuthPort; }
	const std::string& GetClientID() { return m_strClientID; }
	const std::string& GetClientSecret() { return m_strClientSecret; }

	void GetToken(std::string& token, std::string& tokenType) {
		boost::shared_lock<boost::shared_mutex> lock(m_mutexToken);	// read lock
		token = m_Token;
		tokenType = m_TokenType;
	}
 

public:
	bool Init(const char* wszPCHost, const char* wszPcPort,
		const char* wszOAuthServiceHost, const char* wszOAuthPort,
		const char* strClientId, const char* wszClientSecret, int nConnectionCount,
		const std::function<int(int lvl, const char* logStr)>& cb);
	QueryStatus  CheckSingleResource(const IPolicyRequest* ceRequest, IPolicyResult** pcResult);
	QueryStatus  CheckMultiResource (const IPolicyRequest** pcRequest, int nRequestCount, IPolicyResult** pcResult);
	IPolicyRequest*  CreatePolicyRequest();
	IAttributes* CreateCEAttr();

	void  FreePolicyRequest(IPolicyRequest* pRequest);
	void  FreePolicyResult(IPolicyResult* pResult);
	void  FreeCEAttr(IAttributes* pAttr);

        void  WriteLog(int level, const char*szLog){
 	     m_WriteLogFun(level, szLog);
        }           

private:
	// expires_in OPTIONAL. If specified, the token returned expires in the seconds specified.
	// Users can request tokens that are valid for a maximum of one year, which is 3600 * 24 * 365 seconds.
	// If this parameter is omitted, the default value, 3600, is used.
	bool RequestToken(bool force = false);
	//static DWORD WINAPI RefreshTokenThread(LPVOID lpParam);

private:
	bool ErrCheck(CloudAZConnection* pConn, QueryStatus qs);

private:
	std::string m_strPCHost;
	std::string m_strPCPort;
	std::string m_strOAuthHost;
	std::string m_strOAuthPort;
	std::string m_strClientID;
	std::string m_strClientSecret;

	ConnctionPool m_connPool;

	std::string m_Token;
	std::string m_TokenType;
	int m_nTokenExpier = 0;

	std::chrono::steady_clock::time_point m_LastUpdateTime;

	boost::shared_mutex m_mutexToken;

	std::function<int(int lvl, const char* logStr)> m_WriteLogFun;

	static const int MaxTryTimes = 4;
};


#endif


