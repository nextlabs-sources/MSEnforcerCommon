using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QueryCloudAZSDK
{
    /// <summary>
    /// Specify log level
    /// </summary>
    public enum LogLevel
    {
        /// <summary>
        /// Debug logs
        /// </summary>
        Debug,
        /// <summary>
        /// Warning logs
        /// </summary>
        Warning,
        /// <summary>
        /// Error logs
        /// </summary>
        Error,
        /// <summary>
        /// No logs
        /// </summary>
        None
    }

    /// <summary>
    /// Delegate function for output logs
    /// </summary>
    /// <param name="strMsg">log message</param>
    public delegate void DelegateLog(string strMsg);

    /// <summary>
    /// Log class.
    /// user need initialize to set the log function and then used to output logs.
    /// </summary>
    static public class CELog
    {
        #region Const/Read only values
        static private string kstrCELogHeader = "QueryCloudAZSDK";
        static private string kstrCELogHeaderWithColon = "QueryCloudAZSDK: ";
        #endregion

        #region Static members
        static private DelegateLog s_pLog = null;
        static private LogLevel s_emLogLevel = LogLevel.None;
        #endregion

        #region Init
        /// <summary>
        /// Used to initialize log delegate function for custom logs. User need make sure the environment is thread saved when you invoke this function to do initialize.
        /// </summary>
        /// <param name="delegateLog">a delegate function, used to output logs, if this is null no logs.</param>
        /// <param name="emLogLevel">basic log level, only the level is above this basic level, the log can be output.</param>
        static public void Init(DelegateLog delegateLog, LogLevel emLogLevel = LogLevel.None)
        {
            s_pLog = delegateLog;
            s_emLogLevel = emLogLevel;
        }
        #endregion

        #region Output logs
        /// <summary>
        /// Output logs, before use this function to output log, you need first to invoke function "Init" to initialize.
        /// </summary>
        /// <param name="emLogLevel">log level, only the level is above this basic level which set by function "Init", the log can be output.</param>
        /// <param name="strMsg">log information</param>
        static public void OutputLog(LogLevel emLogLevel, string strMsg)
        {
            if ((emLogLevel >= s_emLogLevel) && (LogLevel.None != emLogLevel))
            {
                if (null != s_pLog)
                {
                    s_pLog(string.Format("[{0}]:[{1}]", kstrCELogHeader, strMsg));
                }
            }
        }
        /// <summary>
        /// Output logs, before use this function to output log, you need first to invoke function "Init" to initialize.
        /// </summary>
        /// <param name="emLogLevel">log level</param>
        /// <param name="strFormat">string format</param>
        /// <param name="szArgs">format objects</param>
        static public void OutputLog(LogLevel emLogLevel, string strFormat, params object[] szArgs)
        {
            if ((emLogLevel >= s_emLogLevel) && (LogLevel.None != emLogLevel))
            {
                if (null != s_pLog)
                {
                    s_pLog(kstrCELogHeaderWithColon + string.Format(strFormat, szArgs));
                }
            }
        }
        #endregion
    }
}




