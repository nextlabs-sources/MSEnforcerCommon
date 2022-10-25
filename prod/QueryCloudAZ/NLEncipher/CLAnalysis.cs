using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NLEncipher
{
    class CLAnalysis
    {
        public CLAnalysis(string strKeyPrefix, bool bKeyIncludePrefix, StringComparison emKeyStrComparision)
        {
            m_strKeyPrefix = strKeyPrefix;
            m_bKeyIncludePrefix = bKeyIncludePrefix;
            m_emKeyStrComparision = emKeyStrComparision;
        }

        #region Public method
        public bool Analysis(string[] szArgs)
        {
            if (null == szArgs)
            {
                return false;
            }

            bool bRet = true;
            m_dicArgs = new Dictionary<string, string>();

            int nKeyPrefixLength = m_strKeyPrefix.Length;           
            string strCurKeyName = "";
            foreach(string strItem in szArgs)
            {
                if ((strItem.Length > nKeyPrefixLength) && (strItem.StartsWith(m_strKeyPrefix, m_emKeyStrComparision)))
                {
                    // Current item is key
                    // Save key name and next key index
                    strCurKeyName = m_bKeyIncludePrefix ? strItem : strItem.Substring(nKeyPrefixLength);
                    CommonHelper.AddKeyValuesToDir(m_dicArgs, strCurKeyName, "");
                }
                else
                {
                    // Current item is value
                    if (String.IsNullOrEmpty(strCurKeyName))
                    {
                        // Error, current key is empty
                        bRet = false;
                        break;
                    }
                    else
                    {
                        CommonHelper.AddKeyValuesToDir(m_dicArgs, strCurKeyName, strItem);
                        strCurKeyName = ""; // revert
                    }
                }
            }
            return bRet;
        }
        public string GetValueByKey(string strKeyIn, string strDefault)
        {
            if (m_dicArgs.ContainsKey(strKeyIn))
            {
                return m_dicArgs[strKeyIn];
            }
            return "";
        }
        public bool IsKeyExist(string strKeyIn)
        {
            return m_dicArgs.ContainsKey(strKeyIn);
        }
        public void OutputKeyValueInfo()
        {
            MyLog.Log("Flags, KeyPrefix:[{0}], KeyIncludePrefix:[{1}], KeyStringComparision:[{2}]", m_strKeyPrefix, m_bKeyIncludePrefix, m_emKeyStrComparision);
            foreach (KeyValuePair<string,string> pairItem in m_dicArgs)
            {
                MyLog.Log("Key:[{0}], value:[{1}]\n", pairItem.Key, pairItem.Value);
            }
        }
        #endregion

        #region Members
        readonly private string m_strKeyPrefix = "-";
        readonly private bool m_bKeyIncludePrefix = true;
        readonly private StringComparison m_emKeyStrComparision = StringComparison.OrdinalIgnoreCase;
        private Dictionary<string, string> m_dicArgs = new Dictionary<string, string>();
        #endregion
    }
}
