using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Security;
using System.IO;
using System.Runtime.Serialization;

namespace SkyDrmRestHelp
{
    class RemoteViewer
    {
        [DataContract]
        private class Paramaters
        {
            [DataMember]
            public RemoteViewAPIInput parameters;
        }

        [DataContract]
        private class RemoteViewAPIInput
        {
            [DataMember]
            public string userName { get; set; }

        //    [DataMember]
         //   public string tenantId { get; set; }

           [DataMember]
           public string tenantName { get; set; }


            [DataMember]
            public string fileName { get; set; }

            [DataMember]
            public string offset { get; set; }

            [DataMember]
            public int operations { get; set; }

        };

        [DataContract]
        private class Resp
        {
            [DataMember]
            public int statusCode { get; set; }
            [DataMember]
            public string message { get; set; }
            [DataMember]
            public string serverTime { get; set; }
            [DataMember]
            public Result results { get; set; }
        }

        [DataContract]
        private class Result
        {
            [DataMember]
            public bool owner { get; set; }
            [DataMember]
            public string duid { get; set; }
            [DataMember]
            public int permissions { get; set; }
            [DataMember]
            public string membership { get; set; }
            [DataMember]
            public string viewerURL { get; set; }
            [DataMember]
            public string[] cookies { get; set; }
        }

        private static readonly Dictionary<int, string> m_dicErrorMsg = new Dictionary<int, string>()
        {
            {400,"Invalid request data." },
            {401, "Authentication failed." },
            {403, "You are not authorized to view this document." },
            {404, "File not found." },
            {415, "File type not supported." },
            {500, "Internal Server Error." },
            {5007,"Invalid/corrupt NXL file." },
            {5008,"Missing dependencies. Assembly files are not supported as of now." }
        };
        public static RemoteViewResult RemoteViewByFileData(string strRemoteViewUrl, string strFileName,
          byte[] byteFileData, LoginData loginData, string strTenantName)
        {
            RemoteViewResult rvResult = new RemoteViewResult();

            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(Function.CheckCertificateValidation);

            HttpWebRequest request = WebRequest.Create(strRemoteViewUrl) as HttpWebRequest;
            request.Timeout = SkyDrmRestMgr.HttpTimeout;
            request.Method = "POST";
            request.Headers.Add("userId", loginData.userId.ToString());
            request.Headers.Add("ticket", loginData.ticket);
            request.Headers.Add("clientId", loginData.clientId);
            request.Headers.Add("deviceId", "SkyDrmRestHelp");
            request.Headers.Add("platformId", loginData.platformId);

            string boundary = "---------------" + DateTime.Now.Ticks.ToString("x");
            byte[] beginBoundary = Encoding.ASCII.GetBytes("--" + boundary + "\r\n");
            byte[] endBoundary = Encoding.ASCII.GetBytes("--" + boundary + "--\r\n");
            request.ContentType = "multipart/form-data; boundary=" + boundary;

            //write http body
            MemoryStream memStream = new MemoryStream();

            //write parameters
            RemoteViewAPIInput ParaApiInput = new RemoteViewAPIInput();
            ParaApiInput.userName = loginData.userName;
           // ParaApiInput.tenantId = strTenantID;
            ParaApiInput.tenantName = strTenantName;
            ParaApiInput.fileName = strFileName;
            ParaApiInput.offset = "0";
            ParaApiInput.operations = 0;

            Paramaters para = new Paramaters();
            para.parameters = ParaApiInput;

            string strPara = Function.JsonSerializeObject(para, typeof(Paramaters));

            string stringKeyHeader = "Content-Disposition: form-data; name=\"{0}\"\r\nContent-Type: application/json\r\n\r\n{1}\r\n";
            string bodyApiInput = string.Format(stringKeyHeader, "API-input", strPara);
            byte[] bodyApiInputByte = Encoding.UTF8.GetBytes(bodyApiInput);

            memStream.Write(beginBoundary, 0, beginBoundary.Length);
            memStream.Write(bodyApiInputByte, 0, bodyApiInputByte.Length);

            //write file value
            {
                memStream.Write(beginBoundary, 0, beginBoundary.Length);

                const string filePartHeader =
      "Content-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\n" +
      "Content-Type: application/octet-stream\r\n\r\n";
                var header = string.Format(filePartHeader, "file", strFileName);
                var headerbytes = Encoding.UTF8.GetBytes(header);

                memStream.Write(headerbytes, 0, headerbytes.Length);

           
                memStream.Write(byteFileData, 0, byteFileData.Length);
             
                string end = "\r\n";
                headerbytes = Encoding.UTF8.GetBytes(end);
                memStream.Write(headerbytes, 0, headerbytes.Length);
              
            }

            //write end boundry
            memStream.Write(endBoundary, 0, endBoundary.Length);

            //prepare send request
            request.ContentLength = memStream.Length;

            memStream.Position = 0;
            byte[] tempBuffer = memStream.ToArray();
            memStream.Read(tempBuffer, 0, tempBuffer.Length);
            memStream.Close();

            var requestStream = request.GetRequestStream();
            requestStream.Write(tempBuffer, 0, tempBuffer.Length);
            requestStream.Close();

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
            catch(WebException webEx)
            {
                rvResult.statusCode = 500;
                rvResult.message = webEx.Message;

                HttpWebResponse webResponse = webEx.Response as HttpWebResponse;
                if(webResponse!=null)
                {
                    rvResult.statusCode = (int)webResponse.StatusCode;

                    strResult = Function.GetHttpWebResponseContent(webResponse);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                }
            
                return rvResult;
            }
            catch (Exception ex)
            {
                rvResult.statusCode = 501;
                rvResult.message = string.Format("exception on request.GetResponse:{0}", ex.Message);
                return rvResult;
            }


            //parse result
            try
            {
                Resp rspa = Function.JsonParseObject<Resp>(strResult);

                rvResult.statusCode = rspa.statusCode;
                rvResult.message = rspa.message;

                if (rspa.statusCode == 200)
                {
                    rvResult.remoteViewData = new RemoteViewData();
                    rvResult.remoteViewData.viewUrl = rspa.results.viewerURL;
                    rvResult.remoteViewData.Cookie = rspa.results.cookies;
                }

                //rewrite message
                if (m_dicErrorMsg.ContainsKey(rvResult.statusCode))
                {
                    rvResult.message = m_dicErrorMsg[rvResult.statusCode];
                }

            }
            catch (Exception ex)
            {
                rvResult.statusCode = 500;
                rvResult.message = string.Format("exception on parse result:{0}, result:{1}", ex.Message, strResult);
                return rvResult;
            }


            return rvResult;
        }

        public static RemoteViewResult RemoteViewByFileName(string strRemoteViewUrl, string strNxlFile, LoginData loginData,
            string strTenantName)
        {
           

            //check input
            if(!strNxlFile.ToLower().EndsWith(".nxl"))
            {
                RemoteViewResult rvResult = new RemoteViewResult();
                rvResult.statusCode = 400;
                rvResult.message = "the file is not nxl file:" + strNxlFile;
                return rvResult;
            }

            //get file name
            string strFileName = Path.GetFileName(strNxlFile);

            //read file
            byte[] byteFileData = null;
            using (System.IO.FileStream fs = new FileStream(strNxlFile, FileMode.Open, FileAccess.Read))
            {
                byteFileData = new byte[fs.Length];
                int nReadLen = fs.Read(byteFileData, 0, byteFileData.Length);
                fs.Close();

                if(nReadLen!=byteFileData.Length)
                {
                    RemoteViewResult rvResult = new RemoteViewResult();
                    rvResult.statusCode = 400;
                    rvResult.message = "the file is not nxl file:" + strNxlFile;
                    return rvResult;
                }
            }

            return RemoteViewByFileData(strRemoteViewUrl, strFileName, byteFileData, loginData, 
                strTenantName);
        }
    }
}
