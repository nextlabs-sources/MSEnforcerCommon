using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NLEncipher
{
    class MyLog
    {
        public static void Log(string strLog)
        {
            Console.WriteLine(strLog);
        }
        public static void Log(string strFormat, params object[] szArgs)
        {
            Console.WriteLine(strFormat, szArgs);
        }
    }
}
