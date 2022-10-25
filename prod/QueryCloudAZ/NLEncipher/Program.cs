using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace NLEncipher
{
    class Program
    {
        #region Read only values
        private static readonly string kstrCLKeyPrefix = "-";
        private static readonly string kstrCLKey_Encrypt = "-e";
        private static readonly string kstrCLKey_Decrypt = "-d";
        #endregion
        static void PrintHelp()
        {
            Console.WriteLine("Command help info:");
            Console.WriteLine("\tEncrypt content: {0} \"content\"", kstrCLKey_Encrypt);
            Console.WriteLine("\tDecrypt content: {0} \"content\"", kstrCLKey_Decrypt);
        }
        /* Command line
         * 1. NLEncipher.exe -e "content" [-outf "out file path"] ==> output encrypt content, if do not specify output file path, just print in console
         * 2. NLEncipher.exe -d "content" [-outf "out file path"] ==> output plaintext content
         * 3. NLEncipher.exe -e -inf "input file path" [-outf "out file path"] ==> encrypt file, if do not specify output file path, auto generate a tmp in source file folder.
         * 4. NLEncipher.exe -d -inf "input file path" [-outf "out file path"] ==> output plaintext content
         */
        static void Main(string[] szArgs)
        {
            CLAnalysis obCLAnalysis = new CLAnalysis(kstrCLKeyPrefix, true, StringComparison.OrdinalIgnoreCase);
            bool bRet = obCLAnalysis.Analysis(szArgs);
            if (!bRet)
            {
                PrintHelp();
            }
            else
            {
                if (obCLAnalysis.IsKeyExist(kstrCLKey_Encrypt))
                {
                    string strInputContent = obCLAnalysis.GetValueByKey(kstrCLKey_Encrypt, "");
                    if (string.IsNullOrEmpty(strInputContent))
                    {
                        PrintHelp();
                    }
                    else
                    {
                        // Encrypt content
                        EncryptHelper obEncryptHelperIns = EncryptHelper.GetInstance();
                        byte[] szByPlaintext = Encoding.UTF8.GetBytes(strInputContent);
                        byte[] szByCilphertext = obEncryptHelperIns.EncryptContent(szByPlaintext);
                        string strBase64Ciphertext = Convert.ToBase64String(szByCilphertext);
                        MyLog.Log("Ciphertext: {0}", strBase64Ciphertext);
                    }
                }
                else if (obCLAnalysis.IsKeyExist(kstrCLKey_Decrypt))
                {
                    string strInputContent = obCLAnalysis.GetValueByKey(kstrCLKey_Decrypt, "");
                    if (string.IsNullOrEmpty(strInputContent))
                    {
                        PrintHelp();
                    }
                    else
                    {
                        // Encrypt content
                        EncryptHelper obEncryptHelperIns = EncryptHelper.GetInstance();
                        byte[] szByCiphertext = Convert.FromBase64String(strInputContent);
                        byte[] szByPlaintext = obEncryptHelperIns.DecryptContent(szByCiphertext);
                        string strPlaintext = Encoding.UTF8.GetString(szByPlaintext);                       
                        MyLog.Log("Plaintext: {0}", strPlaintext);
                    }
                }
                else
                {
                    PrintHelp();
                }
            }
        }
    }
}
