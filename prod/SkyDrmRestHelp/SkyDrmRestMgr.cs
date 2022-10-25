using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyDrmRestHelp
{
    public class SkyDrmRestMgr
    {
        private readonly string m_rmsBasicLoginUrl = "/rms/rs/usr";
        private readonly string m_rmsTrustAppLoginUrl = "/rms/rs/login/trustedapp";
        private readonly string m_strGetNonceUrl = "/rms/rs/login/trustedapp/nonce";
        private readonly string m_rmsRemoteViewUrl = "/rms/rs/remoteView/local";
        private readonly string m_rmsClassifyProfileUrl = "/rms/rs/classification/";
        private readonly string m_rmsUserProfileUrl = "/rms/rs/usr/v2/profile";
        private string m_rmsHost;
        private  static readonly int m_httpTimeout = 15 * 1000;

        private enum TENANT_TYPE
        {
            DEFAULT=0,
            PROJECT=1,
            SYSTEM_BUCKET=2,
        }

        public void Init(string rmsHost)
        {
            m_rmsHost = rmsHost;
        }

        public static int HttpTimeout
        {
            get { return m_httpTimeout; }
        }


        public NonceResult GetRmxLoginNonce(string strAppID, string strAppKey)
        {
            NonceResult nonceResult = RmsLogin.GetRmxLoginNonce(m_rmsHost + m_strGetNonceUrl, strAppID, strAppKey);
            return nonceResult;
        }

        public LoginResult RetriveFullProfileV2(string userId, string userTicket,string clientId, string platformId)
        {
            LoginResult loginRes = RmsLogin.RetriveFullProfileV2(m_rmsHost + m_rmsUserProfileUrl, userId,
                                                                 userTicket, clientId, platformId);
            return loginRes;
        }

        public  LoginResult TrustAppLoginRMS(string strJsonParameters)
        {
            System.Diagnostics.Trace.WriteLine("TrustAppLoginRMS Para:" + strJsonParameters);
            LoginResult loginRes = null;
            int nTryTime = 0;
            do
            {
                nTryTime++;
                try
                {
                    loginRes = RmsLogin.TrustAppLoginRMS(m_rmsHost + m_rmsTrustAppLoginUrl, strJsonParameters);
                }
                catch (System.Exception ex)
                {
                    System.Diagnostics.Trace.WriteLine("TrustAppLoginRMS exception:" + ex.ToString());
                }
               
            } while ((nTryTime < 2) && (loginRes == null || loginRes.statusCode != 200));

            return loginRes;
        }

        public LoginResult Login(int idpType, string strUserName, string strPwdMd5)
        {
            if(idpType==0)
            {
                LoginResult loginRes = null;
                int nTryTime = 0;
                do 
                {
                    nTryTime++;
                    loginRes = RmsLogin.BasicLoginRMS(m_rmsHost + m_rmsBasicLoginUrl, strUserName, strPwdMd5);

                } while ((nTryTime<2) && (loginRes==null || loginRes.statusCode!=200) );

                return loginRes;
            }
            else if(idpType==4)
            {
                return new LoginResult();
            }
            else
            {
                LoginResult loginRes = new LoginResult();
                loginRes.statusCode = 500;
                loginRes.message = string.Format("idpType:{0} is not support.", idpType);
                return loginRes;
            }  
        }

        public RemoteViewResult RemoteView(string strNxlFilePath, LoginData lData)
        {
            Membership ms = GetDefaultMemberShip(lData);//user default tenant to view
            if(ms==null)
            {
                RemoteViewResult rvResult = new RemoteViewResult();
                rvResult.statusCode = 500;
                rvResult.message = string.Format("user:{0} get default tenant failed.", lData.userName);
                return rvResult;
            }
            else
            {
                string strTenantName = GetTenantNameByMembershipID(ms.id);
                RemoteViewResult rvResult = null;
                int nTryTime = 0;
                do
                {
                    nTryTime++;
                    rvResult = RemoteViewer.RemoteViewByFileName(m_rmsHost + m_rmsRemoteViewUrl, strNxlFilePath,
                        lData, strTenantName);

                } while ((nTryTime < 2) && ((rvResult == null) || (rvResult.statusCode != 200)));
                return rvResult;
            }
            
        }

        public RemoteViewResult RemoteView(string strFileName, byte[] byteFileData, LoginData lData)
        {
            Membership ms = GetDefaultMemberShip(lData);//user default tenant to view
            if (ms == null)
            {
                RemoteViewResult rvResult = new RemoteViewResult();
                rvResult.statusCode = 500;
                rvResult.message = string.Format("user:{0} get default tenant failed.", lData.userName);
                return rvResult;
            }
            else
            {
                string strTenantName = GetTenantNameByMembershipID(ms.id);
                RemoteViewResult rvResult = null;
                int nTryTime = 0;
                do 
                {
                    nTryTime++;
                    rvResult = RemoteViewer.RemoteViewByFileData(m_rmsHost + m_rmsRemoteViewUrl, strFileName, 
                        byteFileData, lData, strTenantName);

                } while ((nTryTime<2) && ((rvResult==null) || (rvResult.statusCode!=200)));
                return rvResult;
            }

        }

        public ClassificationResult GetClassificationProfile(LoginData lData,string tenantName)
        {
            Membership ms = null;
            if (string.IsNullOrWhiteSpace(tenantName))
            {
                ms = GetDefaultMemberShip(lData);
            }
            else
            {
                bool isSystemBucket = IsSystemBucket(lData, tenantName);
                if (isSystemBucket)
                {
                    ms = GetDefaultMemberShip(lData);
                }
                else
                {
                    ms = GetMemberShipByTenantName(lData, tenantName);
                }
            }
            

            if (ms==null)
            {
                ClassificationResult clsResult = new ClassificationResult();
                clsResult.statusCode = 500;
                clsResult.message = string.Format("user:{0} can't get default membership", lData.userName);
                return clsResult;
            }
            else
            {
                ClassificationResult clsResult = null;
                int nTryTime = 0;
                do 
                {
                    nTryTime++;
                    clsResult = ClassificationProfile.GetClassificationProfile(m_rmsHost + m_rmsClassifyProfileUrl, lData, ms.tokenGroupName);
                } while ((nTryTime<2) && ((clsResult==null) || (clsResult.statusCode!=200) ));

                return clsResult;
                
            }
        }


        private string GetTenantNameByMembershipID(string strMemberShipID)
        {
            int nPos = strMemberShipID.IndexOf('@');
            if (nPos>0)
            {
                return strMemberShipID.Substring(nPos + 1);
            }

            return "";
        }

        private string GetTenantIDByTenantName(LoginData lData, string tenantName)
        {
            Membership[] mss = lData.memberships;
            if(mss!=null)
            {
                foreach(Membership ms  in mss)
                {
                    if(ms.id.EndsWith(tenantName))
                    {
                        return ms.tenantId;
                    }
                }
            }

            return "";
        }

        private Membership GetMemberShipByTenantName(LoginData lData, string tenantName)
        {
            string strTenantNameKey = "@" + tenantName;
            Membership[] mss = lData.memberships;
            if (mss != null)
            {
                foreach (Membership ms in mss)
                {
                    if (ms.id.EndsWith(tenantName))
                    {
                        return ms;
                    }
                }
            }

            return null;
        }

        private Membership GetDefaultMemberShip(LoginData lData)
        {
            Membership[] mss = lData.memberships;
            if (mss != null)
            {
                foreach (Membership ms in mss)
                {
                   if( ms.type == (int)TENANT_TYPE.DEFAULT)
                    {
                        return ms;
                    }
                }
            }

            return null;
        }

        private string GetDefaultTenantID(LoginData lData)
        {
            return lData.tenantId;
        }

        private bool IsSystemBucket(LoginData lData, string tenantName)
        {
            Membership ms = GetMemberShipByTenantName(lData, tenantName);
            if (ms!=null)
            {
                return ms.type == (int)TENANT_TYPE.SYSTEM_BUCKET;
            }

            return false;
        }

    }
}
