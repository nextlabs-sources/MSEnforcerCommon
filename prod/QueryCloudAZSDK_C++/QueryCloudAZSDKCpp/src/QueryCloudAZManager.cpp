
#include "QueryCloudAZManager.h"
#include "PolicyRequest.h"
#include "Attributes.h"
//#include <atlbase.h>
#include "CommonFun.h"
#include "NXLHttpClient.h"

QueryCloudAZMgr::QueryCloudAZMgr()
{

}

bool QueryCloudAZMgr::Init(const char* wszPCHost, const char* wszPcPort,
	                       const char* wszOAuthServiceHost, const char* wszOAuthPort,
	                       const char* strClientId, const char* wszClientSecret,
	                       int nConnectionCount,
						   const std::function<int(int lvl, const char* logStr)>& cb)
{
	m_strPCHost = wszPCHost;
	m_strPCPort = wszPcPort;
	m_strOAuthHost = wszOAuthServiceHost;
	m_strOAuthPort = wszOAuthPort;
	m_strClientID = strClientId;
	m_strClientSecret = wszClientSecret;
	m_WriteLogFun = cb;
	m_connPool.SetConnectCount(nConnectionCount);
	return RequestToken();
}

QueryStatus QueryCloudAZMgr::CheckSingleResource(const IPolicyRequest* ceRequest, IPolicyResult** pcResult)
{
	//assign a connection
	QueryStatus qs = QS_E_InternalError;
	CloudAZConnection* pConn = m_connPool.AssignConnection();
	if (pConn)
	{
		int nTryTime = 0;
		do
		{
			qs = pConn->CheckSingleResource(ceRequest, pcResult);
			if (ErrCheck(pConn, qs))
			{
				break;
			}
			nTryTime++;
		} while (nTryTime < MaxTryTimes);
	}

	return qs;
}

QueryStatus QueryCloudAZMgr::CheckMultiResource(const IPolicyRequest** pcRequest, int nRequestCount, IPolicyResult** pcResult)
{
	//check limit
	if (nRequestCount>MAX_REQUEST_IN_MULTICHECK)
	{
		return QS_E_TooManyRequest;
	}

	//assign a connection
	QueryStatus qs = QS_E_InternalError;
	CloudAZConnection* pConn = m_connPool.AssignConnection();
	if (pConn)
	{
		int nTryTime = 0;
		do
		{
			qs = pConn->CheckMultiResource(pcRequest, nRequestCount, pcResult);
			if (ErrCheck(pConn, qs))
			{
				break;
			}
			nTryTime++;
		} while (nTryTime < MaxTryTimes);
	}

	return qs;
}

IPolicyRequest* QueryCloudAZMgr::CreatePolicyRequest()
{
	return dynamic_cast<IPolicyRequest*>(new PolicyRequest());
}

IAttributes* QueryCloudAZMgr::CreateCEAttr()
{
	return dynamic_cast<IAttributes*>(new Attributes());
}

void QueryCloudAZMgr::FreeCEAttr(IAttributes* pAttr)
{
	delete pAttr;
}

void QueryCloudAZMgr::FreePolicyRequest(IPolicyRequest* pRequest)
{
	delete pRequest;
}

void QueryCloudAZMgr::FreePolicyResult(IPolicyResult* pResult)
{
	delete pResult;
}

bool QueryCloudAZMgr::RequestToken(bool force /* = false */)
{
	auto now_clock = std::chrono::steady_clock::now();

	std::stringstream ssLog;
	ssLog << "RequestToken: now is " << now_clock.time_since_epoch().count() << ", last is " << m_LastUpdateTime.time_since_epoch().count();
	WriteLog(log_info, ssLog.str().c_str());

	boost::unique_lock<boost::shared_mutex> lock(m_mutexToken);	// write lock

	// See also the below expires_in=1800 in AuthBodyFormat, it must be greater than 5 minutes here
	if (!force && 0 < m_nTokenExpier && now_clock - m_LastUpdateTime < std::chrono::minutes(5))
	{
		return true;
	}

	//format body
	const static std::string AuthBodyFormat = "grant_type=client_credentials&client_id=%s&client_secret=%s&expires_in=%d";
	char AuthBody[1024] = { 0 };

	// Encode the client id and secret according to https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
	snprintf(AuthBody, sizeof(AuthBody), AuthBodyFormat.c_str(), UrlEncode(GetClientID()).c_str(), UrlEncode(GetClientSecret()).c_str(), 1800);

#if 1
	NXLHttpClient httpClient(GetOAuthHost().c_str(), GetOAuthPort().c_str());

	//set request paramter
	http::request<http::string_body> req{ http::verb::post, "/cas/token", 11, AuthBody };

	req.set(http::field::user_agent, "QueryCloudAZ_BoostBeast");
	req.set(http::field::connection, "close");
	req.set(http::field::content_type, "application/x-www-form-urlencoded");
	req.set(http::field::content_length, strlen(AuthBody));
	//	req.set("Service", "EVAL");
	//req.set("Version", "1.0");
	req.set("Pragma", "no-cache");

	//send query
	boost::beast::flat_buffer buffer;
	http::response<http::string_body> res;
	try
	{
		httpClient.Request(req, buffer, res);

		if (res.result() == http::status::ok)
		{
			std::stringstream ss(res.body());
			boost::property_tree::ptree ptResponse;

			boost::property_tree::read_json<boost::property_tree::ptree>(ss, ptResponse);
	
			//check error
			boost::optional<pt::ptree&> ptError = ptResponse.get_child_optional("error");
			if (!ptError)
			{
				std::string strToken = ptResponse.get<std::string>("access_token");
				std::string strTokenType = ptResponse.get<std::string>("token_type");
				int nExpire = ptResponse.get<int>("expires_in");

				//set token with write lock
				{
					m_Token = strToken;
					m_TokenType = strTokenType;
					m_nTokenExpier = nExpire;
					m_LastUpdateTime = std::chrono::steady_clock::now();
					ssLog = std::stringstream();
					ssLog << "RequestToken: new last is " << m_LastUpdateTime.time_since_epoch().count() << ", expires_in " << nExpire;
					WriteLog(log_info, ssLog.str().c_str());
				}

				return (!m_Token.empty()) && (!m_TokenType.empty()) && (m_nTokenExpier > 0);
			}
			else
			{
				WriteLog(log_error, ("RequestToken: " + ss.str()).c_str());
			}
		}
	}
	catch (const std::exception& e)
	{
		std::string err = "";
		err += "Query Policy httpClient.Request exception";
		err += e.what();
		WriteLog(log_error, err.c_str());
		return false;
	}



#else
	USES_CONVERSION;

	std::string strHost = GetOAuthHost() + ":" + GetOAuthPort();
	web::http::client::http_client httpClient(A2W(strHost.c_str()));
	try
	{
		//set request paramter
		web::http::http_request request(web::http::methods::POST);
		request.set_request_uri(web::http::uri(L"/cas/token"));
		request.headers().add(L"Connection",  "Close");
		request.headers().add(L"User-Agent","QueryCloudAZcpp");
		request.set_body(AuthBody, "application/x-www-form-urlencoded");
		
		web::http::http_response ServerInforResponse = httpClient.request(request).get();
		if (ServerInforResponse.status_code() == web::http::status_codes::OK)
		{
			web::json::value jsonValue = ServerInforResponse.extract_json().get();

			//check error
			if (!jsonValue.has_field(L"error"))
			{
				std::wstring wstrToken = COMMONFUN::GetStringFromJsonValue(jsonValue, L"access_token");
				std::wstring wstrTokenType = COMMONFUN::GetStringFromJsonValue(jsonValue, L"token_type");
				int nExpire = COMMONFUN::GetIntFromJsonValue(jsonValue, L"expires_in");

				//set token with write lock
				{
					boost::unique_lock<boost::shared_mutex> lock(m_mutexToken);	// write lock
					m_Token = W2A(wstrToken.c_str());
					m_TokenType = W2A(wstrTokenType.c_str());
					m_nTokenExpier = nExpire;
				}

				return (!m_Token.empty()) && (!m_TokenType.empty()) && (m_nTokenExpier>0);
			}
		}
	}
	catch (...)
	{
	}
#endif 

	
	return false;
}

bool QueryCloudAZMgr::ErrCheck(CloudAZConnection* pConn, QueryStatus qs)
{
	if (qs == QS_E_DisConnect)
	{//reset and try again
		WriteLog(log_info, "qs == QS_E_DisConnect, reset and try again");
		pConn->Reset();
		return false;
	}
	else if (qs == QS_E_Unauthorized)
	{//need refresh token and try again
		WriteLog(log_info, "qs == QS_E_Unauthorized, refresh token and try again");
		RequestToken();
		return false;
	}
	else
	{
		return true;
	}
}
