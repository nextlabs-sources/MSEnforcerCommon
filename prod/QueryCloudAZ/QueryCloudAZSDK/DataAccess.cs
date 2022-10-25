using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;

namespace QueryCloudAZSDK
{
    internal class HttpHelpHttpClient
    {
        #region Members
        private object m_lockObject = new object();
        private System.Net.Http.HttpClient[] m_szClients = new System.Net.Http.HttpClient[Constant.HttpRquest.MaxConnect];
        private int m_nCurrentIndex = 0;
        #endregion

        #region Private fields
        private int CurrentIndex
        {
            get
            {
                lock (m_lockObject)
                {
                    int tempCurrectIndex = m_nCurrentIndex;
                    if (m_nCurrentIndex >= Constant.HttpRquest.MaxConnect-1)
                    {
                        m_nCurrentIndex = 0;
                    }
                    else
                    {
                        m_nCurrentIndex++;
                    }
                    return tempCurrectIndex;
                }
            }
        }
        #endregion

        #region Constructors
        public HttpHelpHttpClient(bool bUseProxy)
        {
            for (int i = 0; i < m_szClients.Length; i++)
            {
                if (bUseProxy)
                {
                    m_szClients[i] = new HttpClient();
                }
                else
                {
                    m_szClients[i] = new HttpClient(new HttpClientHandler { UseProxy = false });
                }
            }

        }
        #endregion

        #region Public functions
        /// <summary>
        /// 
        /// </summary>
        /// <param name="strMethod"></param>
        /// <param name="strContentType"></param>
        /// <param name="lisHeaders"></param>
        /// <param name="strUrl"></param>
        /// <param name="strRequest"></param>
        /// <param name="encode"></param>
        /// <param name="strResponse"></param>
        /// <param name="lisOutHeaders"></param>
        /// <param name="bUseSingleHttpClient">Because cannot add cookie for httpClient, so at 8.0.2 version, we need only use single httpclient object, but at 8.0.3 version, auto use token ,we can create A large number of httpclient object</param>
        /// <returns></returns>
        public QueryStatus SendDataAndGetResponse(string strMethod, string strContentType, List<KeyValuePair<string, string>> lisHeaders, string strUrl, string strRequest, Encoding encode, out string strResponse, out List<KeyValuePair<string, string>> lisOutHeaders, bool bUseSingleHttpClient=false)
        {
            QueryStatus pcResult = QueryStatus.E_Failed;
            lisOutHeaders = new List<KeyValuePair<string, string>>();
            strResponse = string.Empty;
            HttpMethod method = new HttpMethod(strMethod);
            Uri uriSite = new Uri(strUrl);
            HttpRequestMessage requestMessage = new HttpRequestMessage(method, uriSite);
            if (!string.IsNullOrEmpty(strRequest))
            {
                requestMessage.Content = new StringContent(strRequest, encode, strContentType);
                requestMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(strContentType);
            }

            if (lisHeaders != null && lisHeaders.Count > 0)
            {
                foreach (KeyValuePair<string, string> header in lisHeaders)
                {
                    if (header.Value != null)
                    {
                        requestMessage.Headers.Add(header.Key, header.Value);
                    }
                }
            }


            HttpResponseMessage httpResponse;
            try
            {
                int nCurrentIndex = CurrentIndex;
                Console.WriteLine("CurrentIndex:[{0}]", nCurrentIndex);
#if DEBUG
                Stopwatch swSendAsync = new Stopwatch();
                swSendAsync.Start();
#endif
                if (!bUseSingleHttpClient)
                {
                    // httpResponse = m_szClients[CurrentIndex].SendAsync(requestMessage).Result;
                    httpResponse = m_szClients[0].SendAsync(requestMessage).Result;
                }
                else
                {
                    httpResponse = m_szClients[0].SendAsync(requestMessage).Result;
                }
#if DEBUG
                swSendAsync.Stop();
                CELog.OutputLog(LogLevel.Debug, "SendAsync TimeSpan:" + swSendAsync.ElapsedMilliseconds);
#endif
                if (httpResponse.IsSuccessStatusCode)
                {
                    foreach (var p in httpResponse.Headers)
                    {
                        lisOutHeaders.Add(new KeyValuePair<string, string>(p.Key, string.Join(" ", p.Value)));
                    }
                    strResponse = httpResponse.Content.ReadAsStringAsync().Result;
                    pcResult = QueryStatus.S_OK;
                }
                else
                {
                    pcResult = ModelTransform.Function.TransformFromStatusCodeToPcResult(httpResponse.StatusCode);
                }
            }
            catch (Exception /*ex*/)
            {
                pcResult = QueryStatus.E_SendFaild;
            }
            return pcResult;
        }
        #endregion
    }
}
