using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyDrmRestHelp
{
    public class Membership
    {
        public string id;//tenant name
        public int type;
        public string tenantId;
        public int projectId=-1;
        public string tokenGroupName;
    }

    public class LoginData
    {
        public int userId;
        public string userName;
        public string ticket;
        public Int64 ttl;
        public string tenantId;
        public string tenantName;
        public string platformId;
        public string clientId;
        public Membership[] memberships;
    }

    public class LoginResult
    {
        public int statusCode;

        public string message;

        public LoginData loginData;
    }


    public class NonceData
    {
        public string nonce;
    }

    public class NonceResult
    {
        public int statusCode;
        public string message;
        public NonceData results;
    }
}
