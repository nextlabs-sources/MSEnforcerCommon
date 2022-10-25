using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace QueryCloudAZSDK
{
    class CommonHelper
    {
        #region Dictionary helper
        static public TVALUE GetValueByKeyFromDir<TKEY, TVALUE>(Dictionary<TKEY, TVALUE> dirMaps, TKEY tKey, TVALUE tDefaultValue)
        {
            if (null != dirMaps)
            {
                if (dirMaps.ContainsKey(tKey))
                {
                    return dirMaps[tKey];
                }
            }
            return tDefaultValue;
        }
        static public void AddKeyValuesToDir<TKEY, TVALUE>(Dictionary<TKEY, TVALUE> dirMaps, TKEY tKey, TVALUE tValue)
        {
            if (null != dirMaps)
            {
                if (dirMaps.ContainsKey(tKey))
                {
                    dirMaps[tKey] = tValue;
                }
                else
                {
                    dirMaps.Add(tKey, tValue);
                }
            }
        }
        static public void RemoveKeyValuesFromDir<TKEY, TVALUE>(Dictionary<TKEY, TVALUE> dicMaps, TKEY tKey)
        {
            if (null != dicMaps)
            {
                if (dicMaps.ContainsKey(tKey))
                {
                    dicMaps.Remove(tKey);
                }
            }
        }
        static public Dictionary<string, TVALUE> DistinctDictionaryIgnoreKeyCase<TVALUE>(Dictionary<string, TVALUE> dicMaps)
        {
            Dictionary<string, TVALUE> dicCheckedMaps = new Dictionary<string, TVALUE>();
            foreach (KeyValuePair<string, TVALUE> pairItem in dicMaps)
            {
                AddKeyValuesToDir(dicCheckedMaps, pairItem.Key.ToLower(), pairItem.Value);
            }
            return dicCheckedMaps;
        }
        #endregion

        #region Converter
        static public bool ConvertStringToBoolean(string strValue, bool bDefault)
        {
            try
            {
                if ((strValue.Equals("0", StringComparison.OrdinalIgnoreCase)) ||
                    (strValue.Equals("no", StringComparison.OrdinalIgnoreCase)) ||
                    (strValue.Equals("false", StringComparison.OrdinalIgnoreCase)))
                {
                    return false;
                }
                else if ((strValue.Equals("1", StringComparison.OrdinalIgnoreCase)) ||
                         (strValue.Equals("yes", StringComparison.OrdinalIgnoreCase)) ||
                         (strValue.Equals("true", StringComparison.OrdinalIgnoreCase)))
                {
                    return true;
                }
                else
                {
                    return bDefault;
                }
            }
            catch (Exception ex)
            {
                CELog.OutputLog(LogLevel.Error, "Convert:[{0}] to boolean failed, use default value:[{1}], please check.{2}\n", strValue, bDefault, ex.Message);
            }
            return bDefault;
        }
        #endregion
    }
}
