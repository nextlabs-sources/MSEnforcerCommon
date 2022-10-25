using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Xml;

namespace QueryCloudAZSDK
{
    class JPCConfig
    {
        #region XML values
        static public readonly string kstrXmlNode_JPCConfig = "JPCConfig";
        static private readonly string kstrXmlNode_JPCHost = "JPCHost";
        static private readonly string kstrXmlNode_OAuthHost = "OAuthHost";
        static private readonly string kstrXmlNode_ClientID = "ClientID";
        static private readonly string kstrXmlNode_ClientSecureCipherText = "ClientSecureCipherText";
        static private readonly string kstrXmlNode_ClientSecure = "ClientSecure";   // user for dev test
        static private readonly string kstrXmlNode_UseProxy = "UseProxy";
        static private readonly string kstrXmlNode_SDKLogFile = "SDKLogFile";
        #endregion

        #region Fields
        public string JPCHost { get { return m_strJPCHost; } }
        public string OAuthHost { get { return m_strOAuthHost; } }
        public string ClientID { get { return m_strClientID; } }
        public string ClientSecure { get { return m_strClientSecure; } }
        public bool UseProxy { get { return m_bUseProxy; } }
        public string SDKLogFile { get { return m_strSDKLogFile; } }
        #endregion

        #region Members
        string m_strJPCHost = "";
        string m_strOAuthHost = "";
        string m_strClientID = "";
        string m_strClientSecure = "";
        string m_strClientSecureCiphertext = "";
        bool m_bUseProxy = false;
        string m_strSDKLogFile = "";
        #endregion

        #region Singleton
        static private object s_lockForInstance = new object();
        static private JPCConfig s_obJPCConfigIns = null;
        static public JPCConfig GetInstance()
        {
            if (null == s_obJPCConfigIns)
            {
                lock (s_lockForInstance)
                    if (null == s_obJPCConfigIns)
                    {
                        s_obJPCConfigIns = new JPCConfig();
                    }
            }
            return s_obJPCConfigIns;
        }
        private JPCConfig()
        {
        }
        #endregion

        public bool Init(string strJPCConfigFile)
        {
            bool bRet = false;
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(strJPCConfigFile);

                // Select JPC Config
                XmlNode nodeJPCConfig = xmlDoc.SelectSingleNode(kstrXmlNode_JPCConfig);
                if (null != nodeJPCConfig)
                {
                    bRet = Init(nodeJPCConfig);
                }
            }
            catch (Exception ex)
            {
                CELog.OutputLog(LogLevel.Error, string.Format("Load and analysis TDF config file:[{0}] exception, {1}\n", strJPCConfigFile, ex.Message));
            }
            return bRet;
        }

        public bool Init(XmlNode nodeJPCConfig)
        {
            bool bRet = false;
            try
            {
                if (null == nodeJPCConfig)
                {
                    // Empty
                }
                else
                {

                    m_strJPCHost = XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_JPCHost);
                    m_strOAuthHost = XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_OAuthHost);
                    m_strClientID = XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_ClientID);
                    m_strClientSecureCiphertext = XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_ClientSecureCipherText);
                    m_strClientSecure = XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_ClientSecure);
                    m_bUseProxy = CommonHelper.ConvertStringToBoolean(XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_UseProxy), false);
                    m_strSDKLogFile = XMLTools.GetXMLSingleNodeText(nodeJPCConfig, kstrXmlNode_SDKLogFile);
                    if (String.IsNullOrEmpty(m_strClientSecure))
                    {
                        // Convert client secure from cipher text to plain text
                        EncryptHelper obEncryptHelperIns = EncryptHelper.GetInstance();
                        byte[] szByCiphertext = Convert.FromBase64String(m_strClientSecureCiphertext);
                        byte[] szByPlaintext = obEncryptHelperIns.DecryptContent(szByCiphertext);
                        m_strClientSecure = Encoding.UTF8.GetString(szByPlaintext);
                    }

                    bRet = !(String.IsNullOrEmpty(m_strJPCHost) || String.IsNullOrEmpty(m_strOAuthHost) ||
                        String.IsNullOrEmpty(m_strClientID) || String.IsNullOrEmpty(m_strClientSecure));
                }
            }
            catch (Exception ex)
            {
                CELog.OutputLog(LogLevel.Error, "Load and analysis TDF config node:[{0}] exception, {1}\n", nodeJPCConfig, ex.Message);
            }
            return bRet;
        }
    }
}
