using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using System.Net;

namespace SkyDrmRestHelp
{
    class Function
    {
        public static string JsonSerializeObject(object obj, System.Type objType)
        {
            DataContractJsonSerializer jsonSeria = new DataContractJsonSerializer(objType);
            MemoryStream msObj = new MemoryStream();
            jsonSeria.WriteObject(msObj, obj);
            msObj.Position = 0;

            StreamReader sr = new StreamReader(msObj);
            string strResult = sr.ReadToEnd();

            return strResult;
        }

        public static string JsonSerializeObject(object obj)
        {
            DataContractJsonSerializer jsonSeria = new DataContractJsonSerializer(obj.GetType());
            MemoryStream msObj = new MemoryStream();
            jsonSeria.WriteObject(msObj, obj);
            msObj.Position = 0;

            StreamReader sr = new StreamReader(msObj);
            string strResult = sr.ReadToEnd();

            return strResult;
        }

        public static T JsonParseObject<T>(string jstr)
        {
            T resp;
            using (var ms = new MemoryStream(Encoding.Unicode.GetBytes(jstr)))
            {
                DataContractJsonSerializer deseralizer = new DataContractJsonSerializer(typeof(T));
                resp = (T)deseralizer.ReadObject(ms);
            }
            return resp;
        }

        public static string ChangeCookieDomain(string ckstr, string newdomain, out string olddomain)
        {
            olddomain = "";
            string ret = null;
            char[] sep = { ';' };
            string[] strs = ckstr.Split(sep, StringSplitOptions.RemoveEmptyEntries);
            for (int idx = 0; idx < strs.Length; ++idx)
            {
                string str = strs[idx];
                if (str.Contains("="))
                {
                    char[] eq = { '=' };
                    string[] kv = str.Split(eq, StringSplitOptions.RemoveEmptyEntries);
                    if (kv.Length >= 2)
                    {
                        if (kv[0].Trim().ToLower() == "Domain".ToLower())
                        {
                            olddomain = kv[1];
                            kv[1] = newdomain;
                            strs[idx] = string.Join("=", kv);
                        }
                    }
                }
                else if ("Secure".ToLower() == str.Trim().ToLower())
                {
                    // to do
                    strs[idx] = "";
                }
            }
            ret = string.Join(";", strs);
            return ret;
        }

        public static string GetCookieByKey(string ckstr, string key)
        {
            string ret = "";

            char[] sep = { ';' };
            string[] strs = ckstr.Split(sep, StringSplitOptions.RemoveEmptyEntries);
            for (int idx = 0; idx < strs.Length; ++idx)
            {
                string str = strs[idx];
                if (str.Contains("="))
                {
                    char[] eq = { '=' };
                    string[] kv = str.Split(eq, StringSplitOptions.RemoveEmptyEntries);
                    if (kv.Length >= 2)
                    {
                        if (kv[0].Trim().ToLower() == key.ToLower())
                        {
                            return kv[1];
                        }
                    }
                }
            }

            return ret;
        }

        public static bool DownloadFile(string path, byte[] data)
        {
            if (File.Exists(path))
                File.Delete(path);
            FileStream fs = new FileStream(path, FileMode.Create);
            fs.Write(data, 0, data.Length);
            fs.Flush();
            fs.Close();
            return true;
        }
        public static byte[] ReadFile(string path)
        {
            if (!File.Exists(path))
                return null;
            FileStream fs = new FileStream(path, FileMode.Open);
            byte[] ret = new byte[fs.Length];
            fs.Read(ret, 0, ret.Length);
            fs.Close();
            return ret;
        }


        public static bool CheckCertificateValidation(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            return true;
        }

        public static string GetHttpWebResponseContent(HttpWebResponse res)
        {
            string strResult = "";
            try
            {
                using (Stream resStream = res.GetResponseStream())
                {
                    byte[] buffer = new byte[1024];
                    int read;

                    while ((read = resStream.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        strResult += Encoding.UTF8.GetString(buffer, 0, read);
                    }
                }
            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(string.Format("Exception on GetHttpWebResponseContent:{0}", ex.ToString()));            	
            }

            return strResult;
        }
    }
}
