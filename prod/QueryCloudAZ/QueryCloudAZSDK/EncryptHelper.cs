using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace QueryCloudAZSDK
{
    class EncryptHelper
    {
        private EncryptHelper()
        {
            string strKey = "{FB80E368-5A42-4A3E-840B-35B5EA15DDF3}";
            m_obRijndaelManaged = new RijndaelManaged();
            m_obRijndaelManaged.Key = Encoding.UTF8.GetBytes(strKey.Substring(0, 16));
            m_obRijndaelManaged.Mode = CipherMode.ECB;
        }
        private static object s_lockForEncryptHelper = new object();
        private static EncryptHelper s_obEncryptHelperIns = null;
        public static EncryptHelper GetInstance()
        {            
            if (null == s_obEncryptHelperIns)
            {
                lock(s_lockForEncryptHelper)
                {
                    if (null == s_obEncryptHelperIns)
                    {
                        s_obEncryptHelperIns = new EncryptHelper();
                    }
                }
            }
            return s_obEncryptHelperIns;
        }

        // The out content is base64 info
        public byte[] EncryptContent(byte[] szByPlaintextIn)
        {
            ICryptoTransform cTransform = m_obRijndaelManaged.CreateEncryptor();
            byte[] szCipherTextOut = cTransform.TransformFinalBlock(szByPlaintextIn, 0, szByPlaintextIn.Length);
            return szCipherTextOut;
        }
        public byte[] DecryptContent(byte[] szByCiphertextIn)
        {
            ICryptoTransform cTransform = m_obRijndaelManaged.CreateDecryptor();
            byte[] szByPlaintextIn = cTransform.TransformFinalBlock(szByCiphertextIn, 0, szByCiphertextIn.Length);
            return szByPlaintextIn;
        }

        private RijndaelManaged m_obRijndaelManaged;
    }
}
