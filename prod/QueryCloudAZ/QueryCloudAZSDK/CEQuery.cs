using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.IO;
using System.Threading;
using QueryCloudAZSDK.CEModel;
using System.Net;

namespace QueryCloudAZSDK
{
    /// <summary>
    /// Specify the query policy control status
    /// </summary>
    public enum QueryStatus
    {
        /// <summary>
        /// Success
        /// </summary>
        S_OK,
        /// <summary>
        /// Error, unknown reason
        /// </summary>
        E_Failed,
        /// <summary>
        /// Error, unsupported content type
        /// </summary>
        E_ContentTypeNotSupported,
        /// <summary>
        /// Error, send request failed, maybe the PC URL is wrong or some other network issue.
        /// </summary>
        E_SendFaild,
        /// <summary>
        /// Error, get PC response failed, maybe there is some network issue.
        /// </summary>
        E_GetResponseFaild,
        /// <summary>
        /// Error, get a wrong PC response, abnormal response.
        /// </summary>
        E_ResponseStatusAbnormal,
        /// <summary>
        /// Error, get a wrong PC response, cannot analysis the response.
        /// </summary>
        E_TransformResponseFaild,
        /// <summary>
        /// Error, get a wrong PC response, cannot analysis the response to JSON type.
        /// </summary>
        E_TransformToJsonDataFaild,
        /// <summary>
        /// Error, not all necessary info has been set into the request.
        /// </summary>
        E_MissAttributes,
        /// <summary>
        /// Error, unauthorized from policy control.
        /// </summary>
        E_Unauthorized,
        /// <summary>
        /// Error, some unexpected error happened in request.
        /// </summary>
        E_BadRequest,
        /// <summary>
        /// Error, the resource cannot fond in cloud AZ.
        /// </summary>
        E_NotFound,
        /// <summary>
        /// Error, request method not allow.
        /// </summary>
        E_MethodNotAllowed,
        /// <summary>
        /// Error, need proxy authentication.
        /// </summary>
        E_ProxyAuthenticationRequired,
        /// <summary>
        /// Error, request time out.
        /// </summary>
        E_RequestTimeout,
        /// <summary>
        /// Error, request URL is too long.
        /// </summary>
        E_RequestUriTooLong,
        /// <summary>
        /// Error, unsupported media type.
        /// </summary>
        E_UnsupportedMediaType,
        /// <summary>
        /// Error, function is not implemented.
        /// </summary>
        E_NotImplemented,
        /// <summary>
        /// Error, bad gateway.
        /// </summary>
        E_BadGateway,
        /// <summary>
        /// Error, service unavailable.
        /// </summary>
        E_ServiceUnavailable,
        /// <summary>
        /// Error, unsupported HTTP version.
        /// </summary>
        E_HttpVersionNotSupported,
        /// <summary>
        /// Error, gateway timeout.
        /// </summary>
        E_GatewayTimeout,
        /// <summary>
        /// Error, invalid client.
        /// </summary>
        E_InvalidClient
    }

    /// <summary>
    /// Main object for query policy
    /// </summary>
    public class CEQuery
    {
        #region Members
        private int m_mulLimited;
        private string m_strJavaPcHost;
        private string m_strOAuthServiceHost;
        private string m_strAccount = string.Empty;
        private string m_strPassword = string.Empty;
        private int m_nExpiresIn = 0;

        private QueryStatus m_Authorization;
        private string m_strToken;

        private ReaderWriterLock m_rwlockAuthorization = new ReaderWriterLock();
        private ReaderWriterLock m_rwlockToken = new ReaderWriterLock();

        private HttpHelpHttpClient m_HttpClient = null;
        private System.Threading.Timer m_timerUpdateToken;
        #endregion

        #region Private fields
        private string Token
        {
            get
            {
                try
                {
                    m_rwlockToken.AcquireReaderLock(Constant.HttpRquest.TimeOut);
                    if (m_rwlockToken.IsReaderLockHeld)
                    {
                        return m_strToken;
                    }
                    else
                    {
                        return string.Empty;
                    }
                }
                finally
                {
                    m_rwlockToken.ReleaseReaderLock();
                }
            }
            set
            {
                try
                {
                    m_rwlockToken.AcquireWriterLock(Constant.HttpRquest.TimeOut);
                    if (m_rwlockToken.IsWriterLockHeld)
                    {
                        m_strToken = value;
                    }
                }
                finally
                {
                    m_rwlockToken.ReleaseWriterLock();
                }
            }
        }
        private string PCEvaluationApiUrl
        {
            get { return PCHost + Constant.General.JavaPCPDPEvaluationApiSuffix; }
        }
        private string PCPermissionsApiUrl
        {
            get { return PCHost + Constant.General.JavaPCPDPPermissionsApiSuffix; }
        }
        private string PCOauthUrl
        {
            get { return OAuthHost + Constant.General.JavaPCOauthSuffix; }
        }
        #endregion

        #region Public fields
        /// <summary>
        /// Policy control host name
        /// </summary>
        public string PCHost
        {
            get
            {
                return m_strJavaPcHost;
            }
        }
        /// <summary>
        /// Set limited number for multiple evaluation to JPC. (Max is "1000", default is "100")
        /// </summary>
        public int MultipleLimited
        {
            set
            {
                m_mulLimited = value;
            }
        }
        /// <summary>
        /// OAuth Server host name
        /// </summary>
        string OAuthHost
        {
            get
            {
                return m_strOAuthServiceHost;
            }
        }
        /// <summary>
        /// authenticated status
        /// </summary>
        public QueryStatus Authenticated
        {
            get
            {
                try
                {
                    m_rwlockAuthorization.AcquireReaderLock(Constant.HttpRquest.TimeOut);
                    if (m_rwlockAuthorization.IsReaderLockHeld)
                    {
                        return m_Authorization;
                    }
                    else
                    {
                        return QueryStatus.E_Failed;
                    }
                }
                finally
                {
                    m_rwlockAuthorization.ReleaseReaderLock();
                }
            }
            private set
            {
                try
                {
                    m_rwlockAuthorization.AcquireWriterLock(Constant.HttpRquest.TimeOut);
                    if (m_rwlockAuthorization.IsWriterLockHeld)
                    {
                        m_Authorization = value;
                    }
                }
                finally
                {
                    m_rwlockAuthorization.ReleaseWriterLock();
                }
            }
        }
        #endregion

        #region Constructors
        /// <summary>
        /// Construct with parameters, the details please see function CEQuery::Init
        /// </summary>
        /// <param name="strPCHost"></param>
        /// <param name="strOAuthServiceHost"></param>
        /// <param name="strClientId"></param>
        /// <param name="strClientSecret"></param>
        /// <param name="nExpiresIn"></param>
        /// <param name="bUseProxy">config if need use proxy, if current environment no proxy and this set to true it maybe cause a performance issue</param>
        public CEQuery(string strPCHost, string strOAuthServiceHost, string strClientId, string strClientSecret, int nExpiresIn = 10, bool bUseProxy = false)
        {
            Init(strPCHost, strOAuthServiceHost, strClientId, strClientSecret, nExpiresIn, bUseProxy);
        }
        /// <summary>
        /// Construct with config file, the details please see class JPCConfig and function CEQuery::Init
        /// </summary>
        /// <param name="strJPCConfigFilePath">the JPC config file, please see the class JPCConfig</param>
        /// <param name="nExpiresIn"></param>
        public CEQuery(string strJPCConfigFilePath, int nExpiresIn = 10)
        {
            JPCConfig obJPCConfigIns = JPCConfig.GetInstance();
            bool bRet = obJPCConfigIns.Init(strJPCConfigFilePath);
            if (bRet)
            {
                if (!string.IsNullOrEmpty(obJPCConfigIns.SDKLogFile))
                {
                    InitLog(obJPCConfigIns.SDKLogFile);
                }
                Init(obJPCConfigIns.JPCHost, obJPCConfigIns.OAuthHost, obJPCConfigIns.ClientID, obJPCConfigIns.ClientSecure, nExpiresIn, obJPCConfigIns.UseProxy);
            }
            else
            {
                CELog.OutputLog(LogLevel.Debug, "Init JPC config file:[{0}] failed", strJPCConfigFilePath);
            }
        }



        private object logLock = new object();
        private string logFilePath;

        private void log(string message)
        {
            lock (logLock)
            {
                using (StreamWriter writer = File.AppendText(logFilePath))
                {
                    string prefix = DateTime.Now.ToString() + "\t" +
                        "PID:" + Process.GetCurrentProcess().Id + "\t" +
                        "TID:" + Thread.CurrentThread.ManagedThreadId + "\t";
                    writer.WriteLine(prefix + message);
                }
            }

        }

        private void InitLog(string strSDKLogFile)
        {
            logFilePath = strSDKLogFile;
            CELog.Init(log, LogLevel.Debug);
        }



        /// <summary>
        /// This is For ColudAZ
        /// </summary>
        /// <param name="strPCHost">Policy control host name, for example http://jpc.crm.nextlabs.solutions:58080/</param>
        /// <param name="strOAuthServiceHost">OAUTH server  host name, for example https://cc.crm.nextlabs.solutions/</param>
        /// <param name="strClientId">Client ID, for example apiuser</param>
        /// <param name="strClientSecret">Client secret number, for example 123456</param>
        /// <param name="nExpiresIn">set time interval, it will trigger update token event , unit is minute</param>
        /// <param name="bUseProxy">config if need use proxy, if current environment no proxy and this set to true it maybe cause a performance issue</param>
        private void Init(string strPCHost, string strOAuthServiceHost, string strClientId, string strClientSecret, int nExpiresIn = 10, bool bUseProxy = false)
        {
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
#if  DEBUG
            Stopwatch swConstructor = new Stopwatch();
            swConstructor.Start();
#endif
            m_HttpClient = new HttpHelpHttpClient(bUseProxy);
            MultipleLimited = 100; // Set "100" as deafult limited number.
            m_nExpiresIn = nExpiresIn;
            if (!strPCHost.EndsWith(Constant.HttpRquest.HttpSeparator))
            {
                strPCHost = strPCHost + Constant.HttpRquest.HttpSeparator;
            }
            m_strJavaPcHost = strPCHost;
            if (!strOAuthServiceHost.EndsWith(Constant.HttpRquest.HttpSeparator))
            {
                strOAuthServiceHost = strOAuthServiceHost + Constant.HttpRquest.HttpSeparator;
            }
            m_strOAuthServiceHost = strOAuthServiceHost;
            m_strAccount = ModelTransform.UrlEncoder.Encode(strClientId);
            m_strPassword = ModelTransform.UrlEncoder.Encode(strClientSecret);
            m_timerUpdateToken = new Timer(new TimerCallback(TimerCallback_UpdateToken), null, m_nExpiresIn * Constant.General.AutoUpdateCookieTimeUnit, m_nExpiresIn * Constant.General.AutoUpdateCookieTimeUnit);
            RefreshToken();
#if  DEBUG
            swConstructor.Stop();
            CELog.OutputLog(LogLevel.Debug, "Constructor TimeSpan:" + swConstructor.ElapsedMilliseconds);
#endif
        }
        /// <summary>
        /// This is Deconstruction.
        /// </summary>
        ~CEQuery()
        {
            m_timerUpdateToken.Dispose();
        }
        #endregion
        #region Public functions
        /// <summary>
        /// Refresh token when the token is expired
        /// </summary>
        public void RefreshToken()
        {
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "UpdateToken Start...");
#endif
            QueryStatus tempAuthorizationed = QueryStatus.E_Unauthorized;
            string strResponse = null;
            List<KeyValuePair<string, string>> lisOutHeaders = null;
            //Q:why ExpiresIn+1?
            //A:Allow token to be longer than the update time , make Prevent updates without authentication
            tempAuthorizationed = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_X_WWW_From_Urlencoded, null, PCOauthUrl, new RestModel.Authorized.TokenRequest(m_strAccount, m_strPassword, (m_nExpiresIn + 1) * Constant.General.AutoUpdateTokenTimeUnit).ToString(), Encoding.ASCII, out strResponse, out lisOutHeaders);
            if (tempAuthorizationed.Equals(QueryStatus.S_OK))
            {
                RestModel.Authorized.TokenResponse tokenResponse = ModelTransform.Function.TransformFromJSONToTokenResponse(strResponse);
                if (!string.IsNullOrEmpty(tokenResponse.access_token) && !string.IsNullOrEmpty(tokenResponse.token_type))
                {
                    Token = tokenResponse.token_type + " " + tokenResponse.access_token;
                }
                else
                {
                    tempAuthorizationed = ModelTransform.Function.TransformFromInvaillTokenToPcResult(strResponse);
                }
            }
            else
            {
#if  DEBUG
                CELog.OutputLog(LogLevel.Debug, "Getting Token Failed, Result:" + tempAuthorizationed);
#endif
            }
            Authenticated = tempAuthorizationed;
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "UpdateToken End");
#endif


        }
        /// <summary>
        /// Query policy by request info and return policy result and obligations.
        /// </summary>
        /// <param name="ceRequest">CERequest contains all the information for query policy, for details you can see CERequest object introduce.</param>
        /// <param name="emPolicyResult">
        /// Policy result return from PC:
        ///     Allow: policy allow
        ///     Deny: policy deny
        ///     DontCare: no policy matched
        /// Note, if there is some error happens, this value also will be set as DontCare.
        /// </param>
        /// <param name="listObligation">All obligations returned from PC. If there is no obligations or some error happens, it is an empty object.</param>
        /// <returns>QueryStatus.S_OK, success, otherwise failed.</returns>
        public QueryStatus CheckResource(CERequest ceRequest, out PolicyResult emPolicyResult, out List<CEObligation> listObligation)
        {
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "CheckResource Start...");
            Stopwatch swCheckResource = new Stopwatch();
            swCheckResource.Start();
#endif
            QueryStatus pcResult = QueryStatus.E_Failed;
            emPolicyResult = PolicyResult.DontCare;
            listObligation = new List<CEObligation>();
            try
            {
                List<KeyValuePair<string, string>> lisHeaders = new List<KeyValuePair<string, string>>();
                {
                    lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Service, Constant.HttpRquest.Service_Eval));
                    lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Version, Constant.HttpRquest.Version_1_0));
                    if (!string.IsNullOrEmpty(Token))
                    {
                        lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Authorization, Token));
                    }
                }

                RestModel.Request.RestRequest restRequest = ModelTransform.Function.TransformToSingleRequest(ceRequest);
                string strRestRequest = restRequest.ToString();
#if  DEBUG
                CELog.OutputLog(LogLevel.Debug, "Rest Request:" + strRestRequest);
#endif
                if (strRestRequest != null && strRestRequest.Length > 0)
                {
                    string strResponse = null;
                    List<KeyValuePair<string, string>> lisOutHeaders = null;
                    //8.0.2 don't use token so , we can use it to distinguish versions
                    if (!string.IsNullOrEmpty(Token))
                    {
                        pcResult = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_JSON, lisHeaders, PCEvaluationApiUrl, strRestRequest, Encoding.ASCII, out strResponse, out lisOutHeaders);
                    }
                    else
                    {
                        pcResult = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_JSON, lisHeaders, PCEvaluationApiUrl, strRestRequest, Encoding.ASCII, out strResponse, out lisOutHeaders, true);
                    }
#if DEBUG
                    CELog.OutputLog(LogLevel.Debug, "Rest Response:" + strResponse);
#endif
                    if (pcResult.Equals(QueryStatus.S_OK))
                    {
                        RestModel.Request.EvaluationResultNode restResult = null;
                        RestModel.Request.EvaluationRestResponse restResponse = ModelTransform.Function.TransformFromJSONToEvaluationRestResponse(strResponse);
                        if (restResponse != null && restResponse.Response != null && restResponse.Response.Result != null && restResponse.Response.Result.Count > 0)
                        {
                            restResult = restResponse.Response.Result[0];
                        }
                        // Add new response formart to support JavaPC 8.7
                        if (restResult == null)
                        {
                            RestModel.Request.EvaluationNewRestResponse newRestResponse = ModelTransform.Function.TransformFromJSONToEvaluationNewRestResponse(strResponse);
                            if (newRestResponse != null && newRestResponse.Response != null && newRestResponse.Response.Count > 0)
                            {
                                restResult = newRestResponse.Response[0];
                            }
                        }
                        if (restResult != null)
                        {
                            if (restResult.Status != null && restResult.Status.StatusMessage != null && restResult.Status.StatusCode != null && restResult.Status.StatusCode.Value != null)
                            {
                                string strStatusCode = restResult.Status.StatusCode.Value;
                                pcResult = ModelTransform.Function.TransformFromStatusToPcResult(strStatusCode);
                                if (pcResult.Equals(QueryStatus.S_OK))
                                {
                                    emPolicyResult = ModelTransform.Function.TransformToCEResponse(restResult.Decision);
                                    listObligation = ModelTransform.Function.TransformToCEObligation(restResult);
                                }
                            }
                            else
                            {
                                pcResult = QueryStatus.E_ResponseStatusAbnormal;
                                CELog.OutputLog(LogLevel.Error, "PDP response detail:" + strResponse);
                            }
                        }
                        else
                        {
                            pcResult = QueryStatus.E_TransformResponseFaild;
                        }

                    }
                    else
                    {
#if  DEBUG
                        CELog.OutputLog(LogLevel.Debug, "SendDataAndGetResponse Failed");
#endif
                    }
                }
                else
                {
                    pcResult = QueryStatus.E_TransformToJsonDataFaild;
                }
            }
            catch (Exception exp)
            {
                pcResult = QueryStatus.E_Failed;
#if  DEBUG
                CELog.OutputLog(LogLevel.Debug, "CheckResource Exception:" + exp);
#endif
            }
#if  DEBUG
            swCheckResource.Stop();
            CELog.OutputLog(LogLevel.Debug, "CheckResource End Query Result:" + pcResult + " TimeSpan:" + swCheckResource.ElapsedMilliseconds);
#endif
            return pcResult;
        }

        /// <summary>
        /// Query policy by request info and return policy result and obligations.
        /// </summary>
        /// <param name="ceListRequests">Multiple CERequests contains all the information for query policy, for details you can see CERequest object introduce.</param>
        /// <param name="listPolicyResults">
        /// Multiple Policy results return from PC:
        ///     Allow: policy allow
        ///     Deny: policy deny
        ///     DontCare: no policy matched
        /// Note, if there is some error happens, this value also will be set as DontCare.
        /// </param>
        /// <param name="listObligations">All obligations returned from PC. If there is no obligations or some error happens, it is an empty object.</param>
        /// <returns>QueryStatus.S_OK, success, otherwise failed.</returns>
        public QueryStatus CheckMultipleResources(List<CERequest> ceListRequests, out List<PolicyResult> listPolicyResults, out List<List<CEObligation>> listObligations)
        {
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "CheckMultipleResources Start...");
            Stopwatch swCheckResources = new Stopwatch();
            swCheckResources.Start();
#endif
            QueryStatus pcResult = QueryStatus.E_Failed;
            listPolicyResults = new List<PolicyResult>();
            listObligations = new List<List<CEObligation>>();
            if (ceListRequests == null)
            {
                return pcResult;
            }
            int i = 0;
            int count = ceListRequests.Count;
            while(true)
            {
                List<PolicyResult> listResults = null;
                List<List<CEObligation>> lsObligations = null;
                if (count > i + m_mulLimited)
                {
                    List<CERequest> limitedRequests = ceListRequests.GetRange(i, m_mulLimited);
                    pcResult = CheckLimitMultipleResources(limitedRequests, out listResults, out lsObligations);
                    listPolicyResults.AddRange(listResults);
                    listObligations.AddRange(lsObligations);
                }
                else
                {
                    List<CERequest> limitedRequests = ceListRequests.GetRange(i, count - i);
                    pcResult = CheckLimitMultipleResources(limitedRequests, out listResults, out lsObligations);
                    listPolicyResults.AddRange(listResults);
                    listObligations.AddRange(lsObligations);
                    break;
                }
                if (pcResult != QueryStatus.S_OK)
                {
                    listPolicyResults = new List<PolicyResult>(count);
                    break;
                }
                i += m_mulLimited; 
            }
#if  DEBUG
            swCheckResources.Stop();
            CELog.OutputLog(LogLevel.Debug, "CheckMultipleResources End Query Result:" + pcResult + ", TimeSpan:" + swCheckResources.ElapsedMilliseconds);
#endif
            return pcResult;
        }

        private QueryStatus CheckLimitMultipleResources(List<CERequest> ceListRequests, out List<PolicyResult> listPolicyResults, out List<List<CEObligation>> listObligations)
        {
            QueryStatus pcResult = QueryStatus.E_Failed;
            listPolicyResults = new List<PolicyResult>();
            listObligations = new List<List<CEObligation>>();
            string strResponse = null;
            try
            {
                List<KeyValuePair<string, string>> lisHeaders = new List<KeyValuePair<string, string>>();
                {
                    lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Service, Constant.HttpRquest.Service_Eval));
                    lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Version, Constant.HttpRquest.Version_1_0));
                    if (!string.IsNullOrEmpty(Token))
                    {
                        lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Authorization, Token));
                    }
                }

                RestModel.Request.RestMultipleRequest restRequest = ModelTransform.Function.TransformMultipleRequests(ceListRequests);
                string strRestRequest = restRequest.ToString();
#if DEBUG
                CELog.OutputLog(LogLevel.Debug, "Rest Request:" + strRestRequest);
#endif
                if (strRestRequest != null && strRestRequest.Length > 0)
                {
                    List<KeyValuePair<string, string>> lisOutHeaders = null;
                    //8.0.2 don't use token so , we can use it to distinguish versions
                    if (!string.IsNullOrEmpty(Token))
                    {
                        pcResult = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_JSON, lisHeaders, PCEvaluationApiUrl, strRestRequest, Encoding.ASCII, out strResponse, out lisOutHeaders);
                    }
                    else
                    {
                        pcResult = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_JSON, lisHeaders, PCEvaluationApiUrl, strRestRequest, Encoding.ASCII, out strResponse, out lisOutHeaders, true);
                    }
#if DEBUG
                    CELog.OutputLog(LogLevel.Debug, "Rest Response:" + strResponse);
#endif
                    if (pcResult.Equals(QueryStatus.S_OK))
                    {
                        List<RestModel.Request.EvaluationResultNode> listRestResult = null;
                        RestModel.Request.EvaluationRestResponse restResponse = ModelTransform.Function.TransformFromJSONToEvaluationRestResponse(strResponse);
                        if (restResponse != null && restResponse.Response != null && restResponse.Response.Result != null && restResponse.Response.Result.Count > 0)
                        {
                            listRestResult = restResponse.Response.Result;
                        }
                        // Add new response formart to support JavaPC 8.7
                        if (listRestResult == null || listRestResult.Count == 0)
                        {
                            RestModel.Request.EvaluationNewRestResponse newRestResponse = ModelTransform.Function.TransformFromJSONToEvaluationNewRestResponse(strResponse);
                            if (newRestResponse != null && newRestResponse.Response != null && newRestResponse.Response.Count > 0)
                            {
                                listRestResult = newRestResponse.Response;
                            }
                        }
                        if (listRestResult != null && listRestResult.Count > 0)
                        {
                            foreach (RestModel.Request.EvaluationResultNode restResult in listRestResult)
                            {
                                if (restResult.Status != null && restResult.Status.StatusMessage != null && restResult.Status.StatusCode != null && restResult.Status.StatusCode.Value != null)
                                {
                                    string strStatusCode = restResult.Status.StatusCode.Value;
                                    pcResult = ModelTransform.Function.TransformFromStatusToPcResult(strStatusCode);
                                    if (pcResult.Equals(QueryStatus.S_OK))
                                    {
                                        PolicyResult emPolicyResult = ModelTransform.Function.TransformToCEResponse(restResult.Decision);
                                        listPolicyResults.Add(emPolicyResult);
                                        List<CEObligation> listObligation = ModelTransform.Function.TransformToCEObligation(restResult);
                                        listObligations.Add(listObligation);
                                    }
                                }
                                else
                                {
                                    PolicyResult emPolicyResult = PolicyResult.DontCare;
                                    listPolicyResults.Add(emPolicyResult);
                                    pcResult = QueryStatus.E_ResponseStatusAbnormal;
#if DEBUG
                                    CELog.OutputLog(LogLevel.Error, "PDP response detail:" + strResponse);
#endif
                                }
                            }
                        }
                        else
                        {
                            pcResult = QueryStatus.E_TransformToJsonDataFaild;
                        }
                    }
                    else
                    {
#if DEBUG
                        CELog.OutputLog(LogLevel.Debug, "SendDataAndGetResponse Failed");
#endif
                    }

                }
            }
            catch (Exception exp)
            {
                pcResult = QueryStatus.E_Failed;
#if  DEBUG
                CELog.OutputLog(LogLevel.Debug, "CheckResource Exception:" + exp);
#endif
            }
            return pcResult;
        }

        /// <summary>
        /// Query policy by request info and return policy result and obligations.
        /// </summary>
        /// <param name="cePermissionsRequest">CEPermissionsRequest contains all the information for query policy, for details you can see CEPermissionsRequest object introduce.</param>
        /// <param name="listAllowAction">All allowed actions returned from PC.</param>
        /// <param name="listAllowObligations">All obligation lists for the allowed actions returned from PC. If there is no obligations or some error happens, it is an empty object.</param>
        /// <param name="listDenyAction">All denied actions returned from PC.</param>
        /// <param name="listDenyObligations">All obligation lists for the denied actions returned from PC. If there is no obligations or some error happens, it is an empty object.</param>
        /// <param name="listDontCareAction">All don't-care actions returned from PC.</param>
        /// <param name="listDontCareObligations">All obligation lists for the don't-care actions returned from PC. If there is no obligations or some error happens, it is an empty object.</param>
        /// <returns>QueryStatus.S_OK, success, otherwise failed.</returns>
        public QueryStatus CheckPermissions(CEPermissionsRequest cePermissionsRequest,
            out List<string> listAllowAction, out List<List<CEObligation>> listAllowObligations,
            out List<string> listDenyAction, out List<List<CEObligation>> listDenyObligations,
            out List<string> listDontCareAction, out List<List<CEObligation>> listDontCareObligations)
        {
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "CheckPermissions Start...");
            Stopwatch swCheckPermissions = new Stopwatch();
            swCheckPermissions.Start();
#endif
            QueryStatus pcResult = QueryStatus.E_Failed;
            listAllowAction = new List<string>();
            listAllowObligations = new List<List<CEObligation>>();
            listDenyAction = new List<string>();
            listDenyObligations = new List<List<CEObligation>>();
            listDontCareAction = new List<string>();
            listDontCareObligations = new List<List<CEObligation>>();
            try
            {
                List<KeyValuePair<string, string>> lisHeaders = new List<KeyValuePair<string, string>>();
                {
                    lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Service, Constant.HttpRquest.Service_Eval));
                    lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Version, Constant.HttpRquest.Version_1_0));
                    if (!string.IsNullOrEmpty(Token))
                    {
                        lisHeaders.Add(new KeyValuePair<string, string>(Constant.HttpRquest.Authorization, Token));
                    }
                }

                RestModel.Request.RestRequest restRequest = ModelTransform.Function.TransformToSinglePermissionsRequest(cePermissionsRequest);
                string strRestRequest = restRequest.ToString();
#if  DEBUG
                CELog.OutputLog(LogLevel.Debug, "Rest Request:" + strRestRequest);
#endif
                if (strRestRequest != null && strRestRequest.Length > 0)
                {
                    string strResponse = null;
                    List<KeyValuePair<string, string>> lisOutHeaders = null;
                    //8.0.2 don't use token so , we can use it to distinguish versions
                    if (!string.IsNullOrEmpty(Token))
                    {
                        pcResult = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_JSON, lisHeaders, PCPermissionsApiUrl, strRestRequest, Encoding.ASCII, out strResponse, out lisOutHeaders);
                    }
                    else
                    {
                        pcResult = m_HttpClient.SendDataAndGetResponse(Constant.HttpRquest.Method_Post, Constant.HttpRquest.ContentType_JSON, lisHeaders, PCPermissionsApiUrl, strRestRequest, Encoding.ASCII, out strResponse, out lisOutHeaders, true);
                    }
#if DEBUG
                    CELog.OutputLog(LogLevel.Debug, "Rest Response:" + strResponse);
#endif
                    if (pcResult.Equals(QueryStatus.S_OK))
                    {
                        RestModel.Request.PermissionsRestResponse restResponse = ModelTransform.Function.TransformFromJSONToPermissionsRestResponse(strResponse);

                        if (restResponse != null)
                        {
                            if (restResponse.Status != null && restResponse.Status.StatusCode != null && restResponse.Status.StatusCode.Value != null)
                            {
                                string strStatusCode = restResponse.Status.StatusCode.Value;
                                pcResult = ModelTransform.Function.TransformFromStatusToPcResult(strStatusCode);
                                if (pcResult.Equals(QueryStatus.S_OK))
                                {
                                    if (restResponse.Response != null && restResponse.Response.Count > 0 &&
                                        restResponse.Response[0].ActionsAndObligations != null)
                                    {
                                        if (restResponse.Response[0].ActionsAndObligations.allow != null)
                                        {
                                            foreach (RestModel.Request.ActionAndObligationsNode actionAndObligations in restResponse.Response[0].ActionsAndObligations.allow)
                                            {
                                                listAllowAction.Add(actionAndObligations.Action);
                                                List<CEObligation> listObligation = ModelTransform.Function.TransformToCEObligation2(actionAndObligations);
                                                listAllowObligations.Add(listObligation);
                                            }
                                        }
                                        if (restResponse.Response[0].ActionsAndObligations.deny != null)
                                        {
                                            foreach (RestModel.Request.ActionAndObligationsNode actionAndObligations in restResponse.Response[0].ActionsAndObligations.deny)
                                            {
                                                listDenyAction.Add(actionAndObligations.Action);
                                                List<CEObligation> listObligation = ModelTransform.Function.TransformToCEObligation2(actionAndObligations);
                                                listDenyObligations.Add(listObligation);
                                            }
                                        }
                                        if (restResponse.Response[0].ActionsAndObligations.dontcare != null)
                                        {
                                            foreach (RestModel.Request.ActionAndObligationsNode actionAndObligations in restResponse.Response[0].ActionsAndObligations.dontcare)
                                            {
                                                listDontCareAction.Add(actionAndObligations.Action);
                                                List<CEObligation> listObligation = ModelTransform.Function.TransformToCEObligation2(actionAndObligations);
                                                listDontCareObligations.Add(listObligation);
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                pcResult = QueryStatus.E_ResponseStatusAbnormal;
                                CELog.OutputLog(LogLevel.Error, "PDP response detail:" + strResponse);
                            }
                        }
                        else
                        {
                            pcResult = QueryStatus.E_TransformResponseFaild;
                        }

                    }
                    else
                    {
#if  DEBUG
                        CELog.OutputLog(LogLevel.Debug, "SendDataAndGetResponse Failed");
#endif
                    }
                }
                else
                {
                    pcResult = QueryStatus.E_TransformToJsonDataFaild;
                }
            }
            catch (Exception exp)
            {
                pcResult = QueryStatus.E_Failed;
#if  DEBUG
                CELog.OutputLog(LogLevel.Debug, "CheckPermissions Exception:" + exp);
#endif
            }
#if  DEBUG
            swCheckPermissions.Stop();
            CELog.OutputLog(LogLevel.Debug, "CheckPermissions End Query Result:" + pcResult + " TimeSpan:" + swCheckPermissions.ElapsedMilliseconds);
#endif
            return pcResult;
        }
        #endregion

        #region Private functions
        private string GetX_WWW_Form_UrlencodedData(string strAccount, string strPassword)
        {
            return string.Format(Constant.HttpRquest.X_WWW_From_Urlencoded_Data_Format, strAccount, strPassword);
        }
        private void TimerCallback_UpdateToken(object sender)
        {
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "TimerCallback_UpdateToken Start...");
#endif
            RefreshToken();
#if  DEBUG
            CELog.OutputLog(LogLevel.Debug, "TimerCallback_UpdateToken End...");
#endif
        }
        #endregion
    }     
}