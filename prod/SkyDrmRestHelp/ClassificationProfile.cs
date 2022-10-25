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
    class ClassificationProfile
    {
        [DataContract]
        private class Label
        {
            [DataMember]
            public string name { get; set; }
            [DataMember(Name = "default")]
            public bool mdefault { get; set; }
        }

        [DataContract]
        private class Categorie
        {
            [DataMember]
             public string name { get; set; }
            [DataMember]
            public bool multiSelect { get; set; }
            [DataMember]
            public bool mandatory { get; set; }

            [DataMember]
            public Label[] labels { get; set; }
        }

        [DataContract]
        private class Result
        {
            [DataMember]
            public int maxCategoryNum { get; set; }
            [DataMember]
            public int maxLabelNum { get; set; }
            [DataMember]
            public Categorie[] categories { get; set; }

        }

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

        public static ClassificationResult GetClassificationProfile(string strUrl, LoginData lData, string tenantID)
        {
            ClassificationResult clsResult = new ClassificationResult();
            
            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(Function.CheckCertificateValidation);

            HttpWebRequest request = WebRequest.Create(strUrl + tenantID) as HttpWebRequest;
            request.Timeout = SkyDrmRestMgr.HttpTimeout;
            request.Method = "GET";
            request.Headers.Add("userId", lData.userId.ToString());
            request.Headers.Add("ticket", lData.ticket);
            request.Headers.Add("clientId", lData.clientId);
            request.Headers.Add("deviceId", "\"" + "deviceid" + "\"");
            request.Headers.Add("platformId", lData.platformId);

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
                clsResult.statusCode = 500;
                clsResult.message = webEx.Message;

                HttpWebResponse webResponse = webEx.Response as HttpWebResponse;
                if (webResponse != null)
                {
                    clsResult.statusCode = (int)webResponse.StatusCode;
                    strResult = Function.GetHttpWebResponseContent(webResponse);
                    System.Diagnostics.Trace.WriteLine(string.Format("GetHttpWebResponseContent:{0}", strResult));
                }

                return clsResult;
            }
            catch (Exception ex)
            {
                clsResult.statusCode = 501;
                clsResult.message = string.Format("exception on request.GetResponse:{0}", ex.Message);
                return clsResult;
            }

            //parse result
            try
            {
                Resp rspa = Function.JsonParseObject<Resp>(strResult);

                clsResult.statusCode = rspa.statusCode;
                clsResult.message = rspa.message;

                if (rspa.statusCode == 200)
                {
                    if(rspa.results!=null)
                    {
                        clsResult.data = new ClassificationData();
                        clsResult.data.maxCategoryNum = rspa.results.maxCategoryNum;
                        clsResult.data.maxLabelNum = rspa.results.maxLabelNum;

                        //get categories
                        if(rspa.results.categories!=null)
                        {
                            clsResult.data.categories = new List<ClassifyCategory>();
                            foreach(Categorie cate in rspa.results.categories)
                            {
                                ClassifyCategory clsCate = new ClassifyCategory();
                                clsCate.name = cate.name;
                                clsCate.multiSel = cate.multiSelect;
                                clsCate.mandatory = cate.mandatory;
                                
                                if(cate.labels!=null)
                                {
                                    clsCate.labels = new List<ClassifyLabel>();
                                    foreach(Label label in cate.labels)
                                    {
                                        ClassifyLabel clsLabel = new ClassifyLabel();
                                        clsLabel.bDefault = label.mdefault;
                                        clsLabel.name = label.name;
                                        clsCate.labels.Add(clsLabel);
                                    }
                                }

                                clsResult.data.categories.Add(clsCate);
                            }
                        }
                    }
                    
                }

            }
            catch (Exception ex)
            {
                clsResult.statusCode = 500;
                clsResult.message = string.Format("exception on parse result:{0}, result:{1}", ex.Message, strResult);
                return clsResult;
            }


            return clsResult;
        }
    }
}
