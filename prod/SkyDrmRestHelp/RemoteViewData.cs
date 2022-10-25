using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SkyDrmRestHelp
{
    public class RemoteViewData
    {
        public string[] Cookie;
        public string viewUrl;
    }

    public class RemoteViewResult
    {
        public int statusCode;
        public string message;
        public RemoteViewData remoteViewData;
    }
}
