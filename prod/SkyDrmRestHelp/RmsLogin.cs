using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Net.Security;
using System.Net;
using System.IO;

namespace SkyDrmRestHelp
{
    

    class RmsLogin
    {
        [DataContract]
       private class LoginResp
        {
            [DataMember]
            public int statusCode { get; set; }
            [DataMember]
            public string message { get; set; }
            [DataMember]
            public string serverTime { get; set; }
            [DataMember]
            public Extra extra { get; set; }
        }

        [DataContract]
       private class Extra
        {
            [DataMember]
            public int userId { get; set; }
            [DataMember]
            public string ticket { get; set; }
            [DataMember]
            public Int64 ttl { get; set; }
            [DataMember]
            public string tenantId { get; set; }
            [DataMember]
            public string lt { get; set; }
            [DataMember]
            public string ltId { get; set; }
            [DataMember]
            public string name { get; set; }
            [DataMember]
            public string email { get; set; }
            [DataMember]
            public int idpType { get; set; }

            [DataMember]
            public string defaultTenant { get; set; }

            [DataMember]
            public Membership[] memberships;
        }

        public static NonceResult GetRmxLoginNonce(string strNonceUrl, string strAppID, string strAppKey)
        {
            NonceResult nonceResult = new NonceResult();

            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(Function.CheckCertificateValidation);

            HttpWebRequest request = WebRequest.Create(strNonceUrl) as HttpWebRequest;
            request.Timeout = SkyDrmRestMgr.HttpTimeout;
            request.Method = "GET";
            request.Headers.Add("userid", strAppID);
            request.Headers.Add("ticket", strAppKey);
            request.Headers.Add("clientId", "rmxresthelp");

            //get result
            string strResult = "";
            try
            {
                using (HttpWebResponse res = (HttpWebResponse)request.GetResponse())
                {
                    strResult = Function.GetHttpWebResponseContent(res);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                    res.Close();
                }
            }
            catch (WebException webEx)
            {
                nonceResult.statusCode = 500;
                nonceResult.message = webEx.Message;

                HttpWebResponse webResponse = webEx.Response as HttpWebResponse;
                if (webResponse != null)
                {
                    nonceResult.statusCode = (int)webResponse.StatusCode;
                    strResult = Function.GetHttpWebResponseContent(webResponse);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                }

                return nonceResult;
            }
            catch (Exception ex)
            {
                nonceResult.statusCode = 501;
                nonceResult.message = string.Format("exception on GetRmxLoginNonce request.GetResponse:{0}", ex.Message);
                return nonceResult;
            }

            //parse result
            try
            {
                NonceResult nonceResultTmp = Function.JsonParseObject<NonceResult>(strResult);
                nonceResult = nonceResultTmp;
            }
            catch (Exception ex)
            {
                nonceResult.statusCode = 502;
                nonceResult.message = string.Format("exception on parse result:{0}, result:{1}", ex.Message, strResult);
                return nonceResult;
            }

            return nonceResult;
        }

        public static LoginResult TrustAppLoginRMS(string strTrustLoginUrl, string strJsonParameters)
        {
            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(Function.CheckCertificateValidation);

            HttpWebRequest request = WebRequest.Create(strTrustLoginUrl) as HttpWebRequest;
            request.Timeout = SkyDrmRestMgr.HttpTimeout;
            request.Method = "POST";
            request.ContentType = "application/json";

            byte[] byteData = Encoding.ASCII.GetBytes(strJsonParameters);
            
            //prepare send request
            request.ContentLength = byteData.Length;
    
            Stream requestStream = request.GetRequestStream();
            requestStream.Write(byteData, 0, byteData.Length);
            requestStream.Close();

            LoginResult lgResult = new LoginResult();
            string strResult = "";
            try
            {
                using (HttpWebResponse res = (HttpWebResponse)request.GetResponse())
                {
                    strResult = Function.GetHttpWebResponseContent(res);

                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                    //deserialize result
                    LoginResp resp = Function.JsonParseObject<LoginResp>(strResult);
                    lgResult.statusCode = resp.statusCode;
                    lgResult.message = resp.message;

                    if (resp.statusCode == 200 && resp.message.Equals("Authorized", StringComparison.OrdinalIgnoreCase))
                    {
                        //get information from cookie
                        string str = res.Headers["Set-Cookie"];
                        char[] sep = { ',' };
                        string[] cks = str.Split(sep);

                        lgResult.loginData = new LoginData();
                        LoginData loginData = lgResult.loginData;
                        foreach (string ck in cks)
                        {
                            if (ck.Contains("clientId"))
                            {
                                loginData.clientId = Function.GetCookieByKey(ck, "clientId");
                            }

                            if (ck.Contains("platformId"))
                            {
                                loginData.platformId = Function.GetCookieByKey(ck, "platformId");
                            }
                        }

                        //get information from body
                        loginData.userId = resp.extra.userId;
                        loginData.ticket = resp.extra.ticket;
                        loginData.ttl = resp.extra.ttl;
                        loginData.tenantId = resp.extra.tenantId;
                        loginData.userName = resp.extra.name;
                        loginData.tenantName = resp.extra.defaultTenant;
                        loginData.memberships = resp.extra.memberships;
                    }

                    res.Close();
                }
            }
            catch (WebException webEx)
            {
                lgResult.statusCode = 500;
                lgResult.message = webEx.Message;

                HttpWebResponse webResponse = webEx.Response as HttpWebResponse;
                if (webResponse != null)
                {
                    lgResult.statusCode = (int)webResponse.StatusCode;

                    strResult = Function.GetHttpWebResponseContent(webResponse);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                }

                return lgResult;
            }
            catch (Exception ex)
            {
                lgResult.statusCode = 501;
                lgResult.message = string.Format("exception on request.GetResponse:{0}", ex.Message);
                return lgResult;
            }

            return lgResult;
        }

        public static LoginResult BasicLoginRMS(string loginUrl, string username, string pwdMd5, string rememberMe="1")
        {
            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(Function.CheckCertificateValidation);

            HttpWebRequest request = WebRequest.Create(loginUrl) as HttpWebRequest;
            request.Timeout = SkyDrmRestMgr.HttpTimeout;
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";

            string tmp = "email=" + username + "&" + "password=" + pwdMd5 + "&" + "rememberMe=" + rememberMe;
            byte[] buf = System.Text.Encoding.Default.GetBytes(tmp);
            request.GetRequestStream().Write(buf, 0, buf.Length);

     
            LoginResult ret = new LoginResult();
            try
            {
                using (HttpWebResponse res = (HttpWebResponse)request.GetResponse())
                {
                    string strResult = Function.GetHttpWebResponseContent(res);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));

                    res.Close();

                    
                    //deserialize result
                    LoginResp resp = Function.JsonParseObject<LoginResp>(strResult);
                    ret.statusCode = resp.statusCode;
                    ret.message = resp.message;

                    if (resp.statusCode == 200 && resp.message.Equals("Authorized", StringComparison.OrdinalIgnoreCase) )
                    {
                        //get information from cookie
                        string str = res.Headers["Set-Cookie"];
                        char[] sep = { ',' };
                        string[] cks = str.Split(sep);

                        ret.loginData = new LoginData();
                        LoginData loginData = ret.loginData;
                        foreach (string ck in cks)
                        {
                            if (ck.Contains("clientId"))
                            {
                                loginData.clientId = Function.GetCookieByKey(ck, "clientId");
                            }

                            if (ck.Contains("platformId"))
                            {
                                loginData.platformId = Function.GetCookieByKey(ck, "platformId");
                            }
                        }

                        //get information from body
                        loginData.userId = resp.extra.userId;
                        loginData.ticket = resp.extra.ticket;
                        loginData.ttl = resp.extra.ttl;
                        loginData.tenantId = resp.extra.tenantId;
                        loginData.userName = resp.extra.name;
                        loginData.tenantName = resp.extra.defaultTenant;
                        loginData.memberships = resp.extra.memberships;
                    }
                    
                }
            }
            catch (WebException webEx)
            {
                ret.statusCode = 500;
                ret.message = webEx.Message;

                HttpWebResponse webResponse = webEx.Response as HttpWebResponse;
                if (webResponse != null)
                {
                    ret.statusCode = (int)webResponse.StatusCode;

                    string strResult = Function.GetHttpWebResponseContent(webResponse);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                }
   
                return ret;
            }
            catch (Exception ex)
            {
                ret.statusCode = 501;
                ret.message = ex.Message;
            }

            return ret;
        }

        public static LoginResult RetriveFullProfileV2(string ProfileUrl, string userId, string userTicket,
                                                       string clientId, string platformId)
        {
            LoginResult loginResult = new LoginResult();

            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(Function.CheckCertificateValidation);

            HttpWebRequest request = WebRequest.Create(ProfileUrl) as HttpWebRequest;
            request.Timeout = SkyDrmRestMgr.HttpTimeout;
            request.Method = "GET";
            request.Headers.Add("userId", userId);
            request.Headers.Add("ticket", userTicket);
            request.Headers.Add("clientId", clientId);
            request.Headers.Add("deviceId", "skydrmresthelp");
            request.Headers.Add("platformId", platformId);

            //get result
            string strResult = "";
            try
            {
                using (HttpWebResponse res = (HttpWebResponse)request.GetResponse())
                {
                    strResult = Function.GetHttpWebResponseContent(res);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                    res.Close();
                }
            }
            catch (WebException webEx)
            {
                loginResult.statusCode = 500;
                loginResult.message = webEx.Message;

                HttpWebResponse webResponse = webEx.Response as HttpWebResponse;
                if (webResponse != null)
                {
                    loginResult.statusCode = (int)webResponse.StatusCode;
                    strResult = Function.GetHttpWebResponseContent(webResponse);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                }

                return loginResult;
            }
            catch (Exception ex)
            {
                loginResult.statusCode = 501;
                loginResult.message = string.Format("exception on RetriveFullProfileV2 request.GetResponse:{0}", ex.Message);
                return loginResult;
            }

            //parse result
            try
            {
                LoginResp resp = Function.JsonParseObject<LoginResp>(strResult);
                resp.statusCode = resp.statusCode;
                resp.message = resp.message;

                loginResult.statusCode = resp.statusCode;
                loginResult.message = resp.message;

                if (resp.statusCode == 200)
                {
                    loginResult.loginData = new LoginData();
                    LoginData loginData = loginResult.loginData;

                    loginData.clientId = clientId;
                    loginData.platformId = platformId;
                    loginData.userId = resp.extra.userId;
                    loginData.ticket = resp.extra.ticket;

                    //get information from body
                    loginData.ttl = resp.extra.ttl;
                    loginData.tenantId = resp.extra.tenantId;
                    loginData.userName = resp.extra.name;
                    loginData.tenantName = resp.extra.defaultTenant;
                    loginData.memberships = resp.extra.memberships;

                }

            }
            catch (Exception ex)
            {
                loginResult.statusCode = 502;
                loginResult.message = string.Format("exception on parse result:{0}, result:{1}", ex.Message, strResult);
                return loginResult;
            }


            return loginResult;
        }

    }
}
