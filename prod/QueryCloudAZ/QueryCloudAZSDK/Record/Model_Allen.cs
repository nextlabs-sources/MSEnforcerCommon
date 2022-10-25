using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Collections;

namespace QueryCloudAZSDK.RestModel.Request
{
    [DataContract]
    internal class RestRequest
    {
        [DataMember]
        public RequestNode Request { get; set; }

        public override string ToString()
        {
            return JsonSerializer.SaveToJson(this);
        }
    }

    [DataContract]
    internal class RestMultipleRequest
    {
        [DataMember]
        public RequestMultipleNode Request { get; set; }

        public override string ToString()
        {
            return JsonSerializer.SaveToJson(this);
        }
    }

    [DataContract]
    internal class RequestNode
    {
        [DataMember]
        public string ReturnPolicyIdList { get; set; }

        [DataMember]
        public List<CategoryNode> Category { get; set; }
    }

    [DataContract]
    internal class RequestMultipleNode
    {
        [DataMember]
        public bool CombinedDecision { get; set; }
        [DataMember]
        public bool ReturnPolicyIdList { get; set; }
        [DataMember]
        public string XPathVersion { get; set; }

        [DataMember]
        public List<CategoryMultipleNode> Category { get; set; }
        [DataMember]
        public List<CategoryMultipleNode> Subject { get; set; }
        [DataMember]
        public List<CategoryMultipleNode> Action { get; set; }
        [DataMember]
        public List<CategoryMultipleNode> Resource { get; set; }
        [DataMember]
        public ReferenceNode MultiRequests { get; set; }
    }

    [DataContract]
    internal class ReferenceNode
    {
        [DataMember]
        public List<ReferenceIdNode> RequestReference { get; set; }
    }

    [DataContract]
    internal class ReferenceIdNode
    {
        [DataMember]
        public List<string> ReferenceId { get; set; }
    }

    [DataContract]
    internal class CategoryNode
    {
        [DataMember]
        public string CategoryId { get; set; }

        //[DataMember]
        //public string Id { get; set; }

        [DataMember]
        public List<AttributeNode> Attribute { get; set; }
    }

    [DataContract]
    internal class CategoryMultipleNode
    {
        [DataMember]
        public string CategoryId { get; set; }

        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public List<AttributeNode> Attribute { get; set; }
    }

    [DataContract]
    internal class AttributeNode
    {
        public AttributeNode()
        {
            Value = new List<string>();
        }
        [DataMember]
        public string AttributeId { get; set; }

        [DataMember]
        public List<string> Value { get; set; }

        [DataMember]
        public string DataType { get; set; }

        [DataMember]
        public bool IncludeInResult { get; set; }
    }

    [DataContract]
    internal class EvaluationRestResponse
    {
        [DataMember]
        public EvaluationResponseNode Response { get; set; }
    }
    [DataContract]
    internal class EvaluationResponseNode
    {
        [DataMember]
        public List<EvaluationResultNode> Result { get; set; }
    }

    [DataContract]
    internal class EvaluationNewRestResponse
    {
        [DataMember]
        public List<EvaluationResultNode> Response { get; set; }
    }
    
    [DataContract]
    internal class EvaluationResultNode
    {
        [DataMember]
        public string Decision { get; set; }

        [DataMember]
        public StatusNode Status { get; set; }

        [DataMember]
        public List<ObligationsNode> Obligations { get; set; }
    }

    [DataContract]
    internal class StatusNode
    {
        [DataMember]
        public string StatusMessage { get; set; }
        [DataMember]
        public StatusCodeNode StatusCode { get; set; }
    }
    [DataContract]
    internal class StatusCodeNode
    {
        [DataMember]
        public string Value { get; set; }
    }

    [DataContract]
    internal class ObligationsNode
    {
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public List<AttributeAssignmentNode> AttributeAssignment { get; set; }
    }
    [DataContract]
    internal class AttributeAssignmentNode
    {
        [DataMember]
        public string AttributeId { get; set; }
        [DataMember]
        public List<string> Value { get; set; }
    }

    [DataContract]
    internal class PermissionsRestResponse
    {
        [DataMember]
        public StatusNode Status { get; set; }

        [DataMember]
        public List<PermissionsResultNode> Response { get; set; }
    }

    [DataContract]
    internal class PermissionsResultNode
    {
        [DataMember]
        public ActionsAndObligationsNode ActionsAndObligations { get; set; }
    }

    [DataContract]
    internal class ActionsAndObligationsNode
    {
        [DataMember]
        public List<ActionAndObligationsNode> allow { get; set; }
        [DataMember]
        public List<ActionAndObligationsNode> deny { get; set; }
        [DataMember]
        public List<ActionAndObligationsNode> dontcare { get; set; }
    }

    [DataContract]
    internal class ActionAndObligationsNode
    {
        [DataMember]
        public string Action { get; set; }
        [DataMember]
        public List<string> MatchingPolicies { get; set; }
        [DataMember]
        public List<ObligationsNode> Obligations { get; set; }
    }
}

namespace QueryCloudAZSDK.RestModel.Authorized
{
    internal class TokenRequest
    {
        public TokenRequest()
        {
            GrantType = "client_credentials";
            ExpiresIn = 3600;
        }
        public TokenRequest(string strClientId, string strClientSecret, int iExpiresIn)
        {
            GrantType = "client_credentials";
            ClientId = strClientId;
            ClientSecret = strClientSecret;
            ExpiresIn = iExpiresIn;
        }
        public string GrantType { get; set; }
        public string ClientId {get;set;}
        public string ClientSecret {get;set;}
        public int ExpiresIn { get; set; }
        public override string ToString()
        {
            return string.Format("grant_type={0}&client_id={1}&client_secret={2}&expires_in={3}", GrantType, ClientId, ClientSecret, ExpiresIn);
        }
    }

    [DataContract]
    internal class TokenResponse
    {
        [DataMember]
        public string access_token { get; set; }

        [DataMember]
        public string token_type { get; set; }

        [DataMember]
        public int expires_in { get; set; }

        public override string ToString()
        {
            return JsonSerializer.SaveToJson(this);
        }
    }
}
namespace QueryCloudAZSDK.CEModel
{
    internal enum CEResourceType
    {
        Source = 0,
        Destination = 1,
        NameAttributes = 2
    }
    internal class CEApp
    {
        public CEApp() { }
        public CEApp(string strName, string strPath, string strUrl, CEAttres attres)
        {
            Name = strName;
            Path = strPath;
            Url = strUrl;
            Attres = attres;
        }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Url { get; set; }
        public CEAttres Attres { get; set; }
    }
    internal class CEUser
    {
        public CEUser() { }
        public CEUser(string strSid, string strName, CEAttres attres)
        {
            Sid = strSid;
            Name = strName;
            Attres = attres;
        }
        public string Sid { get; set; }
        public string Name { get; set; }
        public CEAttres Attres { get; set; }
    }
    internal class CEHost
    {
        public CEHost() { }
        public string IPAddress { get; set; }
        public string Name { get; set; }
        public CEAttres Attres { get; set; }
        public CEHost(string strName, string strIPAddress, CEAttres attres)
        {
            Name = strName;
            IPAddress = strIPAddress;
            Attres = attres;
        }
    }
    internal class CEResource
    {
        public CEResource() { }
        public CEResource(string strName, string strType, CEAttres attres)
        {
            SourceName = strName;
            SourceType = strType;
            Attres = attres;
        }
        public string SourceName { get; set; }
        public string SourceType { get; set; }
        public CEAttres Attres { get; set; }
    }

    internal class CEReferenceId
    {
        public CEReferenceId() 
        {
            Subject = string.Empty;
            Resource = string.Empty;
            Action = string.Empty;
            App = string.Empty;
            Host = string.Empty;
            AdditionalData = string.Empty; 
        }
        public CEReferenceId(string strSubject, string strResource, string strAction, string strApp, string strHost, string strAdditionalData)
        {
            Subject = strSubject;
            Resource = strResource;
            Action = strAction;
            App = strApp;
            Host = strHost;
            AdditionalData = strAdditionalData;
        }
        public string Subject { get; set; }
        public string Resource { get; set; }
        public string Action { get; set; }
        public string App { get; set; }
        public string Host { get; set; }
        public string AdditionalData { get; set; }
    }

    /// <summary>
    /// Query policy result: policy allow, policy deny, do not care (no policy matched)
    /// </summary>
    public enum PolicyResult
    {
        /// <summary>
        /// Deny by policy
        /// </summary>
        Deny = 0,
        /// <summary>
        /// Allow by policy
        /// </summary>
        Allow,
        /// <summary>
        /// No policy matched, no need care
        /// </summary>
        DontCare
    }
    /// <summary>
    /// Attribute type format
    /// </summary>
    public enum CEAttributeType
    {
        /// <summary>
        /// XACML string
        /// </summary>
        XacmlString,
        /// <summary>
        /// XACML boolean
        /// </summary>
        XacmlBoolean,
        /// <summary>
        /// XACML integer
        /// </summary>
        XacmlInteger,
        /// <summary>
        /// XACML double
        /// </summary>
        XacmlDouble,
        /// <summary>
        /// XACML time
        /// </summary>
        XacmlTime,
        /// <summary>
        /// XACML date
        /// </summary>
        XacmlDate,
        /// <summary>
        /// XACML date time
        /// </summary>
        XacmlDateTime,
        /// <summary>
        /// XACML date time duration
        /// </summary>
        XacmlDayTimeDuration,
        /// <summary>
        /// XACML year month duration
        /// </summary>
        XacmlYearMonthDuration,
        /// <summary>
        /// XACML URI
        /// </summary>
        XacmlAnyURI,
        /// <summary>
        /// XACML hex binary
        /// </summary>
        XacmlHexBinary,
        /// <summary>
        /// XACML base64 binary
        /// </summary>
        XacmlBase64Binary,
        /// <summary>
        /// XACML RFC822 name
        /// </summary>
        XacmlRfc822Name,
        /// <summary>
        /// XACML X500 name
        /// </summary>
        XacmlX500Name,
        /// <summary>
        /// XACML IP address
        /// </summary>
        XacmlIpAddress,
        /// <summary>
        /// XACML DNS name
        /// </summary>
        XacmlDnsName,
        /// <summary>
        /// XACML XPath expression
        /// </summary>
        XacmlXpathExpression
    }

    /// <summary>
    /// Attribute
    /// </summary>
    public class CEAttribute
    {
        #region Public fields
        /// <summary>
        /// Attribute name
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Attribute value
        /// </summary>
        public string Value { get; set; }
        /// <summary>
        /// Attribute type
        /// </summary>
        public CEAttributeType Type { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Attribute constructor, establish an attribute
        /// </summary>
        /// <param name="strName">Attribute name</param>
        /// <param name="strValue">Attribute value</param>
        /// <param name="emAttributeType">Attribute type</param>
        public CEAttribute(string strName, string strValue, CEAttributeType emAttributeType)
        {
            Name = strName;
            Value = strValue;
            Type = emAttributeType;
        }
        #endregion
    }
    /// <summary>
    /// collection of CEAttribute
    /// </summary>
    public class CEAttres
    {
        #region Members
        private List<CEAttribute> m_lisKeyValuePair = null;
        #endregion

        #region Constructors
        /// <summary>
        /// Constructor, establish CEAttres
        /// </summary>
        public CEAttres()
        {
            m_lisKeyValuePair = new List<CEAttribute>();
        }
        #endregion

        #region Public functions
        /// <summary>
        /// Add new CEAttribute to end of collection
        /// </summary>
        /// <param name="ceAttr">CEAttribute object</param>
        public void AddAttribute(CEAttribute ceAttr)
        {
            m_lisKeyValuePair.Add(ceAttr);
        }
        /// <summary>
        /// Get CEAttribute by index
        /// </summary>
        public CEAttribute this[int nIndex]
        {
            get { return m_lisKeyValuePair[nIndex]; }
        }
        /// <summary>
        /// Get attributes count
        /// </summary>
        public int Count
        {
            get{ return m_lisKeyValuePair.Count; }
        }
        #endregion
    }
    /// <summary>
    /// Evaluation API Request object
    /// </summary>
    public class CERequest
    {
        #region Members
        private string m_strAction = null;
        private CEApp m_ceApp = null;
        private CEUser m_ceUser = null;
        private CEHost m_ceHost = null;
        private CEResource m_ceSource = null;
        private CEResource m_ceDest = null;
        private CEAttres m_ceEnvAttributes = null;
        #endregion

        #region Constructors
        /// <summary>
        /// Constructor, establish CERequest
        /// </summary>
        public CERequest()
        {

        }
        #endregion

        #region Public functions
        /// <summary>
        /// Set request action info
        /// </summary>
        /// <param name="strAction">Action name</param>
        public void SetAction(string strAction)
        {
            m_strAction = strAction;
        }
        /// <summary>
        /// Set request application info
        /// </summary>
        /// <param name="strName">Application name</param>
        /// <param name="strPath">Application path</param>
        /// <param name="strUrl">Application URL</param>
        /// <param name="ceAttres">Application attributes</param>
        public void SetApp(string strName, string strPath, string strUrl, CEAttres ceAttres)
        {
            if (m_ceApp == null)
            {
                m_ceApp = new CEApp();
            }
            m_ceApp.Name = strName;
            m_ceApp.Path = strPath;
            m_ceApp.Url = strUrl;
            m_ceApp.Attres = ceAttres;
        }

        /// <summary>
        /// Set request user info
        /// </summary>
        /// <param name="strSid">User SID</param>
        /// <param name="strName">User name</param>
        /// <param name="ceAttres">User attributes</param>
        public void SetUser(string strSid, string strName, CEAttres ceAttres)
        {
            if (m_ceUser == null)
            {
                m_ceUser = new CEUser();
            }
            m_ceUser.Sid = strSid;
            m_ceUser.Name = strName;
            m_ceUser.Attres = ceAttres;
        }
        /// <summary>
        /// Set request host info
        /// </summary>
        /// <param name="strName">Host name</param>
        /// <param name="strIPAddress">Host IP Address</param>
        /// <param name="ceAttres">Host attributes</param>
        public void SetHost(string strName, string strIPAddress, CEAttres ceAttres)
        {
            if (m_ceHost == null)
            {
                m_ceHost = new CEHost();
            }
            m_ceHost.Name = strName;
            m_ceHost.IPAddress = strIPAddress;
            m_ceHost.Attres = ceAttres;
        }
        /// <summary>
        /// Set request source info
        /// </summary>
        /// <param name="strSourceName">Source name</param>
        /// <param name="strSourceType">Source type</param>
        /// <param name="ceAttres">Source attributes</param>
        public void SetSource(string strSourceName, string strSourceType, CEAttres ceAttres)
        {
            if (m_ceSource == null)
            {
                m_ceSource = new CEResource();
            }
            m_ceSource.SourceName = strSourceName;
            m_ceSource.SourceType = strSourceType;
            m_ceSource.Attres = ceAttres;
        }
        /// <summary>
        /// Set destination info
        /// </summary>
        /// <param name="strDestName">Destination name</param>
        /// <param name="strDestType">Destination type</param>
        /// <param name="ceAttres">Destination attributes</param>
        public void SetDest(string strDestName, string strDestType, CEAttres ceAttres)
        {
            if (m_ceDest == null)
            {
                m_ceDest = new CEResource();
            }
            m_ceDest.SourceName = strDestName;
            m_ceDest.SourceType = strDestType;
            m_ceDest.Attres = ceAttres;
        }
        /// <summary>
        /// Set request environment attributes
        /// </summary>
        /// <param name="ceAttrs">environment attributes</param>
        public void SetEnvAttributes(CEAttres ceAttrs)
        {
            m_ceEnvAttributes = ceAttrs;
        }
        #endregion

        #region Internal functions
        internal string GetAction()
        {
            return m_strAction;
        }
        internal CEApp GetApp()
        {
            return m_ceApp;
        }
        internal CEUser GetUser()
        {
            return m_ceUser;
        }
        internal CEHost GetHost()
        {
            return m_ceHost;
        }
        internal CEResource GetSource()
        {
            return m_ceSource;
        }
        internal CEResource GetDest()
        {
            return m_ceDest;
        }
        internal CEAttres GetEnvAttributes()
        {
            return m_ceEnvAttributes;
        }
        #endregion
    }
    /// <summary>
    /// Permissions API Request object
    /// </summary>
    public class CEPermissionsRequest
    {
        #region Members
        private CEApp m_ceApp = null;
        private CEUser m_ceUser = null;
        private CEResource m_ceSource = null;
        private CEAttres m_ceEnvAttributes = null;
        #endregion

        #region Constructors
        /// <summary>
        /// Constructor, establish CEPermissionsRequest
        /// </summary>
        public CEPermissionsRequest()
        {

        }
        #endregion

        #region Public functions
        /// <summary>
        /// Set request application info
        /// </summary>
        /// <param name="strName">Application name</param>
        /// <param name="strPath">Application path</param>
        /// <param name="strUrl">Application URL</param>
        /// <param name="ceAttres">Application attributes</param>
        public void SetApp(string strName, string strPath, string strUrl, CEAttres ceAttres)
        {
            if (m_ceApp == null)
            {
                m_ceApp = new CEApp();
            }
            m_ceApp.Name = strName;
            m_ceApp.Path = strPath;
            m_ceApp.Url = strUrl;
            m_ceApp.Attres = ceAttres;
        }
        /// <summary>
        /// Set request user info
        /// </summary>
        /// <param name="strSid">User SID</param>
        /// <param name="strName">User name</param>
        /// <param name="ceAttres">User attributes</param>
        public void SetUser(string strSid, string strName, CEAttres ceAttres)
        {
            if (m_ceUser == null)
            {
                m_ceUser = new CEUser();
            }
            m_ceUser.Sid = strSid;
            m_ceUser.Name = strName;
            m_ceUser.Attres = ceAttres;
        }
        /// <summary>
        /// Set request source info
        /// </summary>
        /// <param name="strSourceName">Source name</param>
        /// <param name="strSourceType">Source type</param>
        /// <param name="ceAttres">Source attributes</param>
        public void SetSource(string strSourceName, string strSourceType, CEAttres ceAttres)
        {
            if (m_ceSource == null)
            {
                m_ceSource = new CEResource();
            }
            m_ceSource.SourceName = strSourceName;
            m_ceSource.SourceType = strSourceType;
            m_ceSource.Attres = ceAttres;
        }
        /// <summary>
        /// Set request environment attributes
        /// </summary>
        /// <param name="ceAttrs">environment attributes</param>
        public void SetEnvAttributes(CEAttres ceAttrs)
        {
            m_ceEnvAttributes = ceAttrs;
        }
        #endregion

        #region Internal functions
        internal CEApp GetApp()
        {
            return m_ceApp;
        }
        internal CEUser GetUser()
        {
            return m_ceUser;
        }
        internal CEResource GetSource()
        {
            return m_ceSource;
        }
        internal CEAttres GetEnvAttributes()
        {
            return m_ceEnvAttributes;
        }
        #endregion
    }
    /// <summary>
    /// Obligation object
    /// </summary>
    public class CEObligation
    {
        #region Members
        private CEAttres m_CEAttres = null;
        private string m_strObligationName = string.Empty;
        private string m_strPolicyName = string.Empty;
        #endregion

        #region Constructors
        /// <summary>
        /// Constructor, establish CEObligation
        /// </summary>
        /// <param name="strObligationnName">Oblitaion name</param>
        /// <param name="ceAttres">Obligation attributes</param>
        /// <param name="strPolicyName">Policy name which contains this obligation</param>
        internal CEObligation(string strObligationnName, CEAttres ceAttres, string strPolicyName)
        {
            m_CEAttres = ceAttres;
            m_strObligationName = strObligationnName;
            m_strPolicyName = strPolicyName;
        }
        #endregion

        #region Public functions
        /// <summary>
        /// Get attributes
        /// </summary>
        /// <returns>Return attributes</returns>
        public CEAttres GetCEAttres()
        {
            return m_CEAttres;
        }
        /// <summary>
        /// Get obligation name
        /// </summary>
        /// <returns>Return obligation name</returns>
        public string GetName()
        {
            return m_strObligationName;
        }
        /// <summary>
        /// Get policy name
        /// </summary>
        /// <returns>Return policy name</returns>
        public string GetPolicyName()
        {
            return m_strPolicyName;
        }
        #endregion
    }
}
namespace QueryCloudAZSDK.ModelTransform
{
    class Function
    {
        public static CEModel.PolicyResult TransformToCEResponse(string strRestResponse)
        {
            CEModel.PolicyResult result = CEModel.PolicyResult.DontCare;
            if (strRestResponse.Equals(Constant.RestResponse.Deny , StringComparison.OrdinalIgnoreCase))
            {
                result = CEModel.PolicyResult.Deny;
            }
            else if (strRestResponse.Equals(Constant.RestResponse.Allow, StringComparison.OrdinalIgnoreCase))
            {
                result = CEModel.PolicyResult.Allow;
            }
            return result;
        }

        public static string TransformCEAttributeTypeToString(CEModel.CEAttributeType ceAttributeType)
        {
            string strResult = string.Empty;
            switch (ceAttributeType)
            {
                case CEModel.CEAttributeType.XacmlAnyURI:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#anyURI";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlBase64Binary:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#base64Binary";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlBoolean:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#boolean";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlDate:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#date";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlDateTime:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#dateTime";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlDayTimeDuration:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#dayTimeDuration";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlDnsName:
                    {
                        strResult = "urn:oasis:names:tc:xacml:2.0:data-type:dnsName";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlDouble:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#double";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlHexBinary:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#hexBinary";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlInteger:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#integer";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlIpAddress:
                    {
                        strResult = "urn:oasis:names:tc:xacml:2.0:data-type:ipAddress";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlRfc822Name:
                    {
                        strResult = "urn:oasis:names:tc:xacml:1.0:data-type:rfc822Name";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlString:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#string";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlTime:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#time";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlX500Name:
                    {
                        strResult = "urn:oasis:names:tc:xacml:1.0:data-type:x500Name";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlXpathExpression:
                    {
                        strResult = "urn:oasis:names:tc:xacml:3.0:data-type:xpathExpression";
                    }
                    break;
                case CEModel.CEAttributeType.XacmlYearMonthDuration:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#yearMonthDuration";
                    }
                    break;
                default:
                    {
                        strResult = "http://www.w3.org/2001/XMLSchema#anyURI";
                    }
                    break;
            }
            return strResult;
        }

        public static RestModel.Request.RestRequest TransformToSingleRequest(CEModel.CERequest ceRequest)
        {
            RestModel.Request.RestRequest restModel = new RestModel.Request.RestRequest();

            restModel.Request = new RestModel.Request.RequestNode();
            restModel.Request.ReturnPolicyIdList = true.ToString();
            restModel.Request.Category = new List<RestModel.Request.CategoryNode>();

            #region CEHost
            CEModel.CEHost ceHost = ceRequest.GetHost();
            if(ceHost != null)
            {
                RestModel.Request.CategoryNode categoryHost = new RestModel.Request.CategoryNode();
                categoryHost.CategoryId = Constant.XACML.Host_Host;
                categoryHost.Attribute = new List<RestModel.Request.AttributeNode>();
                SetCEHost(ceHost, categoryHost.Attribute);
                restModel.Request.Category.Add(categoryHost);
            }

            #endregion

            #region CEUSER
            CEModel.CEUser ceUser = ceRequest.GetUser();
            if (ceUser != null)
            {
                RestModel.Request.CategoryNode categorySubject = new RestModel.Request.CategoryNode();
                categorySubject.CategoryId = Constant.XACML.Subject_Access_Subject;
                categorySubject.Attribute = new List<RestModel.Request.AttributeNode>();
                SetCEUser(ceUser, false, categorySubject.Attribute);
                restModel.Request.Category.Add(categorySubject);
            }
            #endregion

            #region CESOURCE
            CEModel.CEResource ceSource = ceRequest.GetSource();
            if (ceSource != null)
            {
                RestModel.Request.CategoryNode categorySource = new RestModel.Request.CategoryNode();
                categorySource.Attribute = new List<RestModel.Request.AttributeNode>();
                categorySource.CategoryId =Constant.XACML.Resource;
                SetCEResource(ceSource, Constant.XACML.Resource_Dimension_From, categorySource.Attribute);
                restModel.Request.Category.Add(categorySource);
            }
            #endregion

            #region CEDest
            CEModel.CEResource ceDest = ceRequest.GetDest();
            if (ceDest != null)
            {
                RestModel.Request.CategoryNode categorySource = new RestModel.Request.CategoryNode();
                categorySource.Attribute = new List<RestModel.Request.AttributeNode>();
                categorySource.CategoryId = Constant.XACML.Resource;
                SetCEResource(ceSource, Constant.XACML.Resource_Dimension_To, categorySource.Attribute);
                restModel.Request.Category.Add(categorySource);
            }
            #endregion

            #region ACTION
            string strAction = ceRequest.GetAction();
            if (strAction != null)
            {
                RestModel.Request.CategoryNode categoryAction = new RestModel.Request.CategoryNode();
                restModel.Request.Category.Add(categoryAction);
                categoryAction.Attribute = new List<RestModel.Request.AttributeNode>();
                categoryAction.CategoryId =Constant.XACML.Action;
                RestModel.Request.AttributeNode attributeAction = new RestModel.Request.AttributeNode();
                categoryAction.Attribute.Add(attributeAction);
                attributeAction.AttributeId =Constant.XACML.Action_Action_Id;
                attributeAction.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeAction.IncludeInResult = false;
                attributeAction.Value.Add( strAction);
            }
            #endregion

            #region CEAPP
            CEModel.CEApp ceApp = ceRequest.GetApp();
            if (ceApp != null)
            {
                RestModel.Request.CategoryNode categoryApplication = new RestModel.Request.CategoryNode();
                categoryApplication.Attribute = new List<RestModel.Request.AttributeNode>();
                categoryApplication.CategoryId =Constant.XACML.Application;
                SetCEApp(ceApp, categoryApplication.Attribute);
                restModel.Request.Category.Add(categoryApplication);                
            }
            #endregion

            #region NAMEATTRIBUTES
            CEModel.CEAttres ceNameAttribute = ceRequest.GetEnvAttributes();
            if (ceNameAttribute != null)
            {
                RestModel.Request.CategoryNode categoryNameAttributes = new RestModel.Request.CategoryNode();
                restModel.Request.Category.Add(categoryNameAttributes);
                categoryNameAttributes.Attribute = new List<RestModel.Request.AttributeNode>();
                categoryNameAttributes.CategoryId =Constant.XACML.Environment;
                SetCEAttrsToList(ceNameAttribute, Constant.XACML.Enviroment_Prefix, categoryNameAttributes.Attribute);
            }
            #endregion

            return restModel;
        }

        public static RestModel.Request.RestMultipleRequest TransformMultipleRequests(List<CEModel.CERequest> ceListRequests)
        {
            RestModel.Request.RestMultipleRequest restModel = new RestModel.Request.RestMultipleRequest();
            restModel.Request = new RestModel.Request.RequestMultipleNode();
            restModel.Request.CombinedDecision = false;
            restModel.Request.ReturnPolicyIdList = false;
            restModel.Request.XPathVersion = "http://www.w3.org/TR/1999/REC-xpath-19991116";
            restModel.Request.Category = new List<RestModel.Request.CategoryMultipleNode>();
            restModel.Request.Subject = new List<RestModel.Request.CategoryMultipleNode>();
            restModel.Request.Action = new List<RestModel.Request.CategoryMultipleNode>();
            restModel.Request.Resource = new List<RestModel.Request.CategoryMultipleNode>();
            restModel.Request.MultiRequests = new RestModel.Request.ReferenceNode();
            restModel.Request.MultiRequests.RequestReference = new List<RestModel.Request.ReferenceIdNode>();

            Dictionary<string, string> dicCEHostId = new Dictionary<string, string>();
            Dictionary<string, string> dicCEUserId = new Dictionary<string, string>();
            Dictionary<string, string> dicRecipentId = new Dictionary<string, string>();
            Dictionary<string, string> dicResourceId = new Dictionary<string, string>();
            Dictionary<string, string> dicActionId = new Dictionary<string, string>();
            Dictionary<string, string> dicAppId = new Dictionary<string, string>();
            Dictionary<string, string> dicEnvironmentId = new Dictionary<string, string>();

            // Just set one Environment.
            SetMultipleEnvironment(restModel, ceListRequests[0]);

            foreach (CEModel.CERequest ceRequest in ceListRequests)
            {
                CEModel.CEReferenceId referenceId = new CEModel.CEReferenceId();
                // Host
                SetMultipleHost(restModel, ceRequest, referenceId, dicCEHostId);

                // User
                SetMultipleUser(restModel, ceRequest, referenceId, dicCEUserId);

                // Resource
                SetMultipleResource(restModel, ceRequest, referenceId, dicResourceId);

                // Action
                SetMultipleAction(restModel, ceRequest, referenceId, dicActionId);

                // App
                SetMultipleApp(restModel, ceRequest, referenceId, dicAppId);                

                SetReferenceId(restModel.Request.MultiRequests.RequestReference, referenceId);
            }

            return restModel;
        }

        public static RestModel.Request.RestRequest TransformToSinglePermissionsRequest(CEModel.CEPermissionsRequest cePermissionsRequest)
        {
            RestModel.Request.RestRequest restModel = new RestModel.Request.RestRequest();

            restModel.Request = new RestModel.Request.RequestNode();
            restModel.Request.ReturnPolicyIdList = true.ToString();
            restModel.Request.Category = new List<RestModel.Request.CategoryNode>();

            #region CEUSER
            CEModel.CEUser ceUser = cePermissionsRequest.GetUser();
            if (ceUser != null)
            {
                RestModel.Request.CategoryNode categorySubject = new RestModel.Request.CategoryNode();
                categorySubject.CategoryId = Constant.XACML.Subject_Access_Subject;
                categorySubject.Attribute = new List<RestModel.Request.AttributeNode>();
                SetCEUser(ceUser, false, categorySubject.Attribute);
                restModel.Request.Category.Add(categorySubject);
            }
            #endregion

            #region CESOURCE
            CEModel.CEResource ceSource = cePermissionsRequest.GetSource();
            if (ceSource != null)
            {
                RestModel.Request.CategoryNode categorySource = new RestModel.Request.CategoryNode();
                categorySource.Attribute = new List<RestModel.Request.AttributeNode>();
                categorySource.CategoryId =Constant.XACML.Resource;
                SetCEResource(ceSource, Constant.XACML.Resource_Dimension_From, categorySource.Attribute);
                restModel.Request.Category.Add(categorySource);
            }
            #endregion

            #region CEAPP
            CEModel.CEApp ceApp = cePermissionsRequest.GetApp();
            if (ceApp != null)
            {
                RestModel.Request.CategoryNode categoryApplication = new RestModel.Request.CategoryNode();
                categoryApplication.Attribute = new List<RestModel.Request.AttributeNode>();
                categoryApplication.CategoryId =Constant.XACML.Application;
                SetCEApp(ceApp, categoryApplication.Attribute);
                restModel.Request.Category.Add(categoryApplication);                
            }
            #endregion

            #region NAMEATTRIBUTES
            CEModel.CEAttres ceNameAttribute = cePermissionsRequest.GetEnvAttributes();
            if (ceNameAttribute != null)
            {
                RestModel.Request.CategoryNode categoryNameAttributes = new RestModel.Request.CategoryNode();
                restModel.Request.Category.Add(categoryNameAttributes);
                categoryNameAttributes.Attribute = new List<RestModel.Request.AttributeNode>();
                categoryNameAttributes.CategoryId =Constant.XACML.Environment;
                SetCEAttrsToList(ceNameAttribute, Constant.XACML.Enviroment_Prefix, categoryNameAttributes.Attribute);
            }
            #endregion

            return restModel;
        }

        private static void SetMultipleHost(RestModel.Request.RestMultipleRequest restModel, CEModel.CERequest ceRequest,
            CEModel.CEReferenceId referenceId, Dictionary<string, string> dicCEHostId)
        {
            CEModel.CEHost ceHost = ceRequest.GetHost();
            if (ceHost != null)
            {
                string ipAddr = ceHost.IPAddress;
                if (string.IsNullOrEmpty(ipAddr))
                {
                    ipAddr = "UnknowHost" + dicCEHostId.Count.ToString();
                }
                if (dicCEHostId.ContainsKey(ipAddr))
                {
                    referenceId.Host = dicCEHostId[ipAddr];
                }
                else
                {
                    RestModel.Request.CategoryMultipleNode categoryHost = new RestModel.Request.CategoryMultipleNode();
                    categoryHost.CategoryId = Constant.XACML.Host_Host;
                    categoryHost.Attribute = new List<RestModel.Request.AttributeNode>();
                    SetCEHost(ceHost, categoryHost.Attribute);
                    restModel.Request.Category.Add(categoryHost);
                    string id = "Host" + dicCEHostId.Count.ToString();
                    dicCEHostId.Add(ipAddr, id);
                    referenceId.Host = id;
                    categoryHost.Id = id;
                }
            }
        }

        private static void SetMultipleUser(RestModel.Request.RestMultipleRequest restModel, CEModel.CERequest ceRequest,
            CEModel.CEReferenceId referenceId, Dictionary<string, string> dicCEUserId)
        {
            CEModel.CEUser ceUser = ceRequest.GetUser();
            if (ceUser != null)
            {
                string sid = ceUser.Sid;
                if (string.IsNullOrEmpty(sid))
                {
                    sid = "UnknowUser" + dicCEUserId.Count.ToString();
                }
                if (dicCEUserId.ContainsKey(sid))
                {
                    referenceId.Subject = dicCEUserId[sid];
                }
                else
                {
                    RestModel.Request.CategoryMultipleNode categorySubject = new RestModel.Request.CategoryMultipleNode();
                    restModel.Request.Subject.Add(categorySubject);                    
                    categorySubject.CategoryId = Constant.XACML.Subject_Access_Subject;
                    categorySubject.Attribute = new List<RestModel.Request.AttributeNode>();
                    SetCEUser(ceUser, false, categorySubject.Attribute);
                    string id = "User" + dicCEUserId.Count.ToString();
                    dicCEUserId.Add(sid, id);
                    referenceId.Subject = id;
                    categorySubject.Id = id;
                }
            }
        }

        private static void SetMultipleResource(RestModel.Request.RestMultipleRequest restModel, CEModel.CERequest ceRequest,
            CEModel.CEReferenceId referenceId, Dictionary<string, string> dicResourceId)
        {
            CEModel.CEResource ceResource = ceRequest.GetSource();
            if (ceResource != null)
            {
                string srcName = ceResource.SourceName;
                if (string.IsNullOrEmpty(srcName))
                {
                    srcName = "UnknowResource" + dicResourceId.Count.ToString();
                }
                if (dicResourceId.ContainsKey(srcName))
                {
                    referenceId.Resource = dicResourceId[srcName];
                }
                else
                {
                    RestModel.Request.CategoryMultipleNode categorySource = new RestModel.Request.CategoryMultipleNode();
                    categorySource.Attribute = new List<RestModel.Request.AttributeNode>();
                    categorySource.CategoryId = Constant.XACML.Resource;
                    SetCEResource(ceResource, Constant.XACML.Resource_Dimension_From, categorySource.Attribute);
                    restModel.Request.Resource.Add(categorySource);
                    string id = "Resource" + dicResourceId.Count.ToString();
                    dicResourceId.Add(srcName, id);
                    referenceId.Resource = id;
                    categorySource.Id = id;
                }
            }
        }
        
        private static void SetMultipleAction(RestModel.Request.RestMultipleRequest restModel, CEModel.CERequest ceRequest,
            CEModel.CEReferenceId referenceId, Dictionary<string, string> dicActionId)
        {
            string strAction = ceRequest.GetAction();
            if (!string.IsNullOrEmpty(strAction))
            {
                if (dicActionId.ContainsKey(strAction))
                {
                    referenceId.Action = dicActionId[strAction];
                }
                else
                {
                    RestModel.Request.CategoryMultipleNode categoryAction = new RestModel.Request.CategoryMultipleNode();
                    restModel.Request.Action.Add(categoryAction);
                    categoryAction.Attribute = new List<RestModel.Request.AttributeNode>();
                    categoryAction.CategoryId = Constant.XACML.Action;
                    RestModel.Request.AttributeNode attributeAction = new RestModel.Request.AttributeNode();
                    categoryAction.Attribute.Add(attributeAction);
                    attributeAction.AttributeId = Constant.XACML.Action_Action_Id;
                    attributeAction.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                    attributeAction.IncludeInResult = false;
                    attributeAction.Value.Add(strAction);
                    string id = "Action" + dicActionId.Count.ToString();
                    dicActionId.Add(strAction, id);
                    referenceId.Action = id;
                    categoryAction.Id = id;
                }
            }
        }

        private static void SetMultipleApp(RestModel.Request.RestMultipleRequest restModel, CEModel.CERequest ceRequest,
            CEModel.CEReferenceId referenceId, Dictionary<string, string> dicAppId)
        {
            CEModel.CEApp ceApp = ceRequest.GetApp();
            if (ceApp != null)
            {
                string appName = ceApp.Name;
                if (string.IsNullOrEmpty(appName))
                {
                    appName = "UnknowApp" + dicAppId.Count.ToString();
                }
                if (dicAppId.ContainsKey(appName))
                {
                    referenceId.App = dicAppId[appName];
                }
                else
                {
                    RestModel.Request.CategoryMultipleNode categoryApplication = new RestModel.Request.CategoryMultipleNode();
                    categoryApplication.Attribute = new List<RestModel.Request.AttributeNode>();
                    categoryApplication.CategoryId = Constant.XACML.Application;
                    SetCEApp(ceApp, categoryApplication.Attribute);
                    restModel.Request.Category.Add(categoryApplication);
                    string id = "App" + dicAppId.Count.ToString();
                    dicAppId.Add(appName, id);
                    referenceId.App = id;
                    categoryApplication.Id = id;
                }
            }
        }

        private static void SetMultipleEnvironment(RestModel.Request.RestMultipleRequest restModel, CEModel.CERequest ceRequest)
        {
            CEModel.CEAttres ceNameAttribute = ceRequest.GetEnvAttributes();
            if (ceNameAttribute != null)
            {
                RestModel.Request.CategoryMultipleNode categoryNameAttributes = new RestModel.Request.CategoryMultipleNode();
                restModel.Request.Category.Add(categoryNameAttributes);
                categoryNameAttributes.Attribute = new List<RestModel.Request.AttributeNode>();
                categoryNameAttributes.CategoryId = Constant.XACML.Environment;
                categoryNameAttributes.Id = "Environment";
                SetCEAttrsToList(ceNameAttribute, Constant.XACML.Enviroment_Prefix, categoryNameAttributes.Attribute);                
            }           
        }

        private static void SetReferenceId(List<RestModel.Request.ReferenceIdNode> listReferenceId, CEModel.CEReferenceId referenceId)
        {
            RestModel.Request.ReferenceIdNode referenceIdNode = new RestModel.Request.ReferenceIdNode();
            referenceIdNode.ReferenceId = new List<string>();
            if (!string.IsNullOrEmpty(referenceId.Subject))
            {
                referenceIdNode.ReferenceId.Add(referenceId.Subject);            
            }
            if (!string.IsNullOrEmpty(referenceId.Action))
            {
                referenceIdNode.ReferenceId.Add(referenceId.Action);
            }
            if (!string.IsNullOrEmpty(referenceId.Resource))
            {
                referenceIdNode.ReferenceId.Add(referenceId.Resource);
            }
            if (!string.IsNullOrEmpty(referenceId.App))
            {
                referenceIdNode.ReferenceId.Add(referenceId.App);
            }
            if (!string.IsNullOrEmpty(referenceId.Host))
            {
                referenceIdNode.ReferenceId.Add(referenceId.Host);
            }
            if (!string.IsNullOrEmpty(referenceId.AdditionalData))
            {
                referenceIdNode.ReferenceId.Add(referenceId.AdditionalData);
            }

            listReferenceId.Add(referenceIdNode);
        }

        public static List<CEModel.CEObligation> TransformToCEObligation(RestModel.Request.EvaluationResultNode restResult)
        {
            List<CEModel.CEObligation> lisResult = new List<CEModel.CEObligation>();
            if (restResult.Obligations != null && restResult.Obligations.Count > 0)
            {
                foreach (RestModel.Request.ObligationsNode restObligation in restResult.Obligations)
                {
                    string strObligationName = restObligation.Id;
                    CEModel.CEAttres ceAttres = new CEModel.CEAttres();
                    if (restObligation.AttributeAssignment != null && restObligation.AttributeAssignment.Count > 0)
                    {

                        foreach (RestModel.Request.AttributeAssignmentNode attributeNode in restObligation.AttributeAssignment)
                        {
                            string strAttrName = attributeNode.AttributeId;
                            string strAttributeValue = string.Join(";", attributeNode.Value.ToArray<string>());
                            ceAttres.AddAttribute(new CEModel.CEAttribute(strAttrName, strAttributeValue, CEModel.CEAttributeType.XacmlString));
                        }

                    }
                    CEModel.CEObligation ceOblitaion = new CEModel.CEObligation(strObligationName, ceAttres, "Sorry, javaPC can not get policy name at this version.");
                    lisResult.Add(ceOblitaion);
                }
            }


            return lisResult;
        }

        public static List<CEModel.CEObligation> TransformToCEObligation2(RestModel.Request.ActionAndObligationsNode restActionAndObligations)
        {
            List<CEModel.CEObligation> lisResult = new List<CEModel.CEObligation>();
            if (restActionAndObligations.Obligations != null && restActionAndObligations.Obligations.Count > 0)
            {
                foreach (RestModel.Request.ObligationsNode restObligation in restActionAndObligations.Obligations)
                {
                    string strObligationName = restObligation.Id;
                    CEModel.CEAttres ceAttres = new CEModel.CEAttres();
                    if (restObligation.AttributeAssignment != null && restObligation.AttributeAssignment.Count > 0)
                    {

                        foreach (RestModel.Request.AttributeAssignmentNode attributeNode in restObligation.AttributeAssignment)
                        {
                            string strAttrName = attributeNode.AttributeId;
                            string strAttributeValue = string.Join(";", attributeNode.Value.ToArray<string>());
                            ceAttres.AddAttribute(new CEModel.CEAttribute(strAttrName, strAttributeValue, CEModel.CEAttributeType.XacmlString));
                        }

                    }
                    CEModel.CEObligation ceOblitaion = new CEModel.CEObligation(strObligationName, ceAttres, "Sorry, javaPC can not get policy name at this version.");
                    lisResult.Add(ceOblitaion);
                }
            }


            return lisResult;
        }

        public static QueryStatus TransformFromStatusToPcResult(string strStatusMessage)
        {
            if(strStatusMessage.Equals(Constant.RestResponseStatus.Status_Ok,StringComparison.OrdinalIgnoreCase))
            {
                return QueryStatus.S_OK;
            }
            else if(strStatusMessage.Equals(Constant.RestResponseStatus.Status_MissAttributes))
            {
                return QueryStatus.E_MissAttributes;
            }
            else
            {
                return QueryStatus.E_ResponseStatusAbnormal;
            }

        }

        public static QueryStatus TransformFromStatusCodeToPcResult(System.Net.HttpStatusCode code)
        {
            QueryStatus pcResult = QueryStatus.E_Failed;
            switch(code)
            {
                case System.Net.HttpStatusCode.BadRequest:
                    pcResult = QueryStatus.E_BadRequest;
                    break;
                case System.Net.HttpStatusCode.Unauthorized:
                    pcResult = QueryStatus.E_Unauthorized;
                    break;
                case System.Net.HttpStatusCode.NotFound:
                    pcResult = QueryStatus.E_NotFound;
                    break;
                case System.Net.HttpStatusCode.MethodNotAllowed:
                    pcResult = QueryStatus.E_MethodNotAllowed;
                    break;
                case System.Net.HttpStatusCode.ProxyAuthenticationRequired:
                    pcResult = QueryStatus.E_ProxyAuthenticationRequired;
                    break;
                case System.Net.HttpStatusCode.RequestTimeout:
                    pcResult = QueryStatus.E_RequestTimeout;
                    break;
                case System.Net.HttpStatusCode.RequestUriTooLong:
                    pcResult = QueryStatus.E_RequestUriTooLong;
                    break;
                case System.Net.HttpStatusCode.UnsupportedMediaType:
                    pcResult = QueryStatus.E_UnsupportedMediaType;
                    break;
                case System.Net.HttpStatusCode.NotImplemented:
                    pcResult = QueryStatus.E_NotImplemented;
                    break;
                case System.Net.HttpStatusCode.BadGateway:
                    pcResult = QueryStatus.E_BadGateway;
                    break;
                case System.Net.HttpStatusCode.ServiceUnavailable:
                    pcResult = QueryStatus.E_ServiceUnavailable;
                    break;
                case System.Net.HttpStatusCode.HttpVersionNotSupported:
                    pcResult = QueryStatus.E_HttpVersionNotSupported;
                    break;
                case System.Net.HttpStatusCode.GatewayTimeout:
                    pcResult = QueryStatus.E_GatewayTimeout;
                    break;

            }
            return pcResult;
        }

        public static QueryStatus TransformFromWebExceptionToPcResult(string strExceptionMessage)
        {
            QueryStatus result = QueryStatus.S_OK;
            switch(strExceptionMessage)
            {
                case "The remote server returned an error: (400) Bad Request.": result = QueryStatus.E_BadRequest;
                    break;
                case "The remote server returned an error: (401) Unauthorized.": result = QueryStatus.E_Unauthorized;
                    break;
                default: result = QueryStatus.E_GetResponseFaild;
                    break;
            }

            return result;
        }

        public static QueryStatus TransformFromInvaillTokenToPcResult(string strJson)
        {
            QueryStatus emResult = QueryStatus.E_Failed;
            switch (strJson)
            {
            case "{\"error\":\"invalid_client\"}":
            {
                emResult = QueryStatus.E_InvalidClient;
                break;
            }
            default:
            {
                break;
            }
            }
            return emResult;
        }

        public static RestModel.Request.EvaluationRestResponse TransformFromJSONToEvaluationRestResponse(string strJson)
        {
            return JsonSerializer.LoadFromJson<RestModel.Request.EvaluationRestResponse>(strJson);
        }

        public static RestModel.Request.EvaluationNewRestResponse TransformFromJSONToEvaluationNewRestResponse(string strJson)
        {
            return JsonSerializer.LoadFromJson<RestModel.Request.EvaluationNewRestResponse>(strJson);
        }

        public static RestModel.Request.PermissionsRestResponse TransformFromJSONToPermissionsRestResponse(string strJson)
        {
            return JsonSerializer.LoadFromJson<RestModel.Request.PermissionsRestResponse>(strJson);
        }

        public static RestModel.Authorized.TokenResponse TransformFromJSONToTokenResponse(string strJson)
        {
            return JsonSerializer.LoadFromJson<RestModel.Authorized.TokenResponse>(strJson);
        }

        private static void SetCEHost(CEModel.CEHost ceHost, List<RestModel.Request.AttributeNode> listAttribute)
        {
            if (!string.IsNullOrEmpty(ceHost.IPAddress))
            {
                RestModel.Request.AttributeNode attributeIPAddress = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeIPAddress);
                attributeIPAddress.AttributeId = Constant.XACML.Host_Inet_Address;
                attributeIPAddress.Value.Add(ceHost.IPAddress);
                attributeIPAddress.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlIpAddress);
                attributeIPAddress.IncludeInResult = false;
            }
            if (!string.IsNullOrEmpty(ceHost.Name))
            {
                RestModel.Request.AttributeNode attributeName = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeName);
                attributeName.AttributeId = Constant.XACML.Host_Name;
                attributeName.Value.Add(ceHost.Name);
                attributeName.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeName.IncludeInResult = false;
            }
            if (ceHost.Attres != null)
            {
                SetCEAttrsToList(ceHost.Attres, Constant.XACML.Host_Prefix, listAttribute);
            }
        }

        private static void SetCEUser(CEModel.CEUser ceUser, bool bRecipent, List<RestModel.Request.AttributeNode> listAttribute)
        {
            if (!string.IsNullOrEmpty(ceUser.Sid))
            {
                RestModel.Request.AttributeNode attributeSid = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeSid);
                attributeSid.AttributeId = bRecipent ? Constant.XACML.Recipient_Id : Constant.XACML.Subject_Subejct_Id;
                attributeSid.Value.Add(ceUser.Sid);
                attributeSid.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeSid.IncludeInResult = false;
            }
            if (!string.IsNullOrEmpty(ceUser.Name))
            {
                RestModel.Request.AttributeNode attributeName = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeName);
                attributeName.AttributeId = bRecipent ? Constant.XACML.Recipient_Name : Constant.XACML.Subject_Subject_Name;
                attributeName.Value.Add(ceUser.Name);
                attributeName.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeName.IncludeInResult = false;
            }
            if (ceUser.Attres != null)
            {
                string strPrefix = bRecipent ? Constant.XACML.Recipient_Prefix : Constant.XACML.Subject_Prefix;
                SetCEAttrsToList(ceUser.Attres, strPrefix, listAttribute);
            }
        }

        private static void SetCEResource(CEModel.CEResource ceSource, string srcType, List<RestModel.Request.AttributeNode> listAttribute)
        {
            if (!string.IsNullOrEmpty(ceSource.SourceName))
            {
                RestModel.Request.AttributeNode attributeSoueceId = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeSoueceId);
                attributeSoueceId.AttributeId = Constant.XACML.Resource_Resource_Id;
                attributeSoueceId.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlAnyURI);
                attributeSoueceId.IncludeInResult = false;
                attributeSoueceId.Value.Add(ceSource.SourceName);
            }
            if (!string.IsNullOrEmpty(ceSource.SourceType))
            {
                RestModel.Request.AttributeNode attributeSourceType = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeSourceType);
                attributeSourceType.AttributeId = Constant.XACML.Resource_Resource_Type;
                attributeSourceType.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlAnyURI);
                attributeSourceType.IncludeInResult = false;
                attributeSourceType.Value.Add(ceSource.SourceType);
            }
            {
                RestModel.Request.AttributeNode attributeSourceDimension = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeSourceDimension);
                attributeSourceDimension.AttributeId = Constant.XACML.Resource_Resource_Dimension;
                attributeSourceDimension.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlAnyURI);
                attributeSourceDimension.IncludeInResult = false;
                attributeSourceDimension.Value.Add(srcType);
            }
            if (ceSource.Attres != null)
            {
                SetCEAttrsToList(ceSource.Attres, Constant.XACML.Resource_Prefix, listAttribute);
            }
        }
       
        private static void SetCEApp(CEModel.CEApp ceApp, List<RestModel.Request.AttributeNode> listAttribute)
        {
            if (!string.IsNullOrEmpty(ceApp.Name))
            {
                RestModel.Request.AttributeNode attributeAppId = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeAppId);
                attributeAppId.AttributeId = Constant.XACML.Application_Application_Id;
                attributeAppId.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeAppId.IncludeInResult = false;
                attributeAppId.Value.Add(ceApp.Name);
            }

            if (!string.IsNullOrEmpty(ceApp.Path))
            {
                RestModel.Request.AttributeNode attributeAppName = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeAppName);
                attributeAppName.AttributeId = Constant.XACML.Application_Application_Name;
                attributeAppName.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeAppName.IncludeInResult = false;
                attributeAppName.Value.Add(ceApp.Path);
            }
            if (!string.IsNullOrEmpty(ceApp.Url))
            {
                RestModel.Request.AttributeNode attributeAppUrl = new RestModel.Request.AttributeNode();
                listAttribute.Add(attributeAppUrl);
                attributeAppUrl.AttributeId = Constant.XACML.Application_Application_Url;
                attributeAppUrl.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(CEModel.CEAttributeType.XacmlString);
                attributeAppUrl.IncludeInResult = false;
                attributeAppUrl.Value.Add(ceApp.Url);
            }
            if (ceApp.Attres != null)
            {
                SetCEAttrsToList(ceApp.Attres, Constant.XACML.Application_Application_Prefix, listAttribute);
            }
        }

        private static void SetCEAttrsToList(CEModel.CEAttres ceAttrs, string strPrefix, List<RestModel.Request.AttributeNode> listAttribute)
        {
            Dictionary<string, RestModel.Request.AttributeNode> dicAttrs = new Dictionary<string, RestModel.Request.AttributeNode>(); 
            int count = ceAttrs.Count;
            for (int i = 0; i < count; i++)
            {
                CEModel.CEAttribute ceAttr = ceAttrs[i];
                string strName = ceAttr.Name;
                string strValue = ceAttr.Value;
                CEModel.CEAttributeType ceAttributeType = ceAttr.Type;
                if (!string.IsNullOrEmpty(strName) && !string.IsNullOrEmpty(strValue))
                {                        
                    RestModel.Request.AttributeNode attributeOther = null;
                    if (dicAttrs.ContainsKey(strName.ToLower()))
                    {
                        attributeOther = dicAttrs[strName.ToLower()];
                    }
                    else
                    {
                        attributeOther = new RestModel.Request.AttributeNode();
                        attributeOther.AttributeId = strPrefix + strName;
                        attributeOther.DataType = ModelTransform.Function.TransformCEAttributeTypeToString(ceAttributeType);
                        attributeOther.IncludeInResult = false;                            
                        listAttribute.Add(attributeOther);
                        dicAttrs.Add(strName.ToLower(), attributeOther);
                    }
                    attributeOther.Value.Add(strValue);                                                                                              
                }
            }
        }
    }
    class UrlEncoder
    {
        public static string Encode(string str)
        {
            if (str == null)
            {
                return null;
            }
            return Encode(str, Encoding.UTF8);
        }

        public static string Encode(string str, Encoding e)
        {
            if (str == null)
            {
                return null;
            }
            return Encoding.ASCII.GetString(UrlEncodeToBytes(str, e));
        }

        internal static byte[] UrlEncodeToBytes(string str, Encoding e)
        {
            if (str == null)
            {
                return null;
            }
            byte[] bytes = e.GetBytes(str);
            return Encode(bytes, 0, bytes.Length, false);
        }

        internal static byte[] Encode(byte[] bytes, int offset, int count, bool alwaysCreateNewReturnValue)
        {
            byte[] buffer = Encode(bytes, offset, count);
            if ((alwaysCreateNewReturnValue && (buffer != null)) && (buffer == bytes))
            {
                return (byte[])buffer.Clone();
            }
            return buffer;
        }

        internal static byte[] Encode(byte[] bytes, int offset, int count)
        {
            if (!ValidateUrlEncodingParameters(bytes, offset, count))
            {
                return null;
            }
            int num = 0;
            int num2 = 0;
            for (int i = 0; i < count; i++)
            {
                char ch = (char)bytes[offset + i];
                if (ch == ' ')
                {
                    num++;
                }
                else if (!IsUrlSafeChar(ch))
                {
                    num2++;
                }
            }
            if ((num == 0) && (num2 == 0))
            {
                return bytes;
            }
            byte[] buffer = new byte[count + (num2 * 2)];
            int num4 = 0;
            for (int j = 0; j < count; j++)
            {
                byte num6 = bytes[offset + j];
                char ch2 = (char)num6;
                if (IsUrlSafeChar(ch2))
                {
                    buffer[num4++] = num6;
                }
                else if (ch2 == ' ')
                {
                    buffer[num4++] = 0x2b;
                }
                else
                {
                    buffer[num4++] = 0x25;
                    buffer[num4++] = (byte)IntToHex((num6 >> 4) & 15);
                    buffer[num4++] = (byte)IntToHex(num6 & 15);
                }
            }
            return buffer;
        }

        internal static bool ValidateUrlEncodingParameters(byte[] bytes, int offset, int count)
        {
            if ((bytes == null) && (count == 0))
            {
                return false;
            }
            if (bytes == null)
            {
                throw new ArgumentNullException("bytes");
            }
            if ((offset < 0) || (offset > bytes.Length))
            {
                throw new ArgumentOutOfRangeException("offset");
            }
            if ((count < 0) || ((offset + count) > bytes.Length))
            {
                throw new ArgumentOutOfRangeException("count");
            }
            return true;
        }

        public static bool IsUrlSafeChar(char ch)
        {
            if ((((ch >= 'a') && (ch <= 'z')) || ((ch >= 'A') && (ch <= 'Z'))) || ((ch >= '0') && (ch <= '9')))
            {
                return true;
            }
            switch (ch)
            {
                case '(':
                case ')':
                case '*':
                case '-':
                case '.':
                case '_':
                case '!':
                    return true;
            }
            return false;
        }

        public static char IntToHex(int n)
        {
            if (n <= 9)
            {
                return (char)(n + 0x30);
            }
            return (char)((n - 10) + 0x61);
        }

    }
}
namespace QueryCloudAZSDK.Constant
{
    static class General
    {
        public const string JavaPCPDPEvaluationApiSuffix = "dpc/authorization/pdp";
        public const string JavaPCPDPPermissionsApiSuffix = "dpc/PDPConnector/pdppermissions";
        public const string JavaPCOauthSuffix = "cas/token";
        public const int AutoUpdateCookieTimeUnit = 60 * 1000;
        public const int AutoUpdateTokenTimeUnit = 60;
        public const string Equal = "=";
    }
    static class HttpRquest
    {
        public const int MaxConnect = 32;
        public  const string Method_Post = "POST";
        public const string Method_Get = "GET";
        public const string Method_Delete = "DELETE";
        public const string Method_Head = "HEAD";
        public const string Method_Options = "OPTIONS";
        public const string Method_Put = "PUT";
        public const string Method_Trace = "TRACE";
        public  const string Service_Eval = "EVAL";
        public const string Service = "Service";
        public const string Version = "Version";
        public const string Authorization = "Authorization";
        public  const string Version_1_0 = "1.0";
        public  const int TimeOut = 60000;

        public  const string ContentType_Unknow = "application/Unknow";
        public  const string ContentType_JSON = "application/json";
        public  const string ContentType_XML = "application/xml";
        public const string ContentType_X_WWW_From_Urlencoded = "application/x-www-form-urlencoded";

        public const string Endcoding_UTF_8 = "UTF-8";

        public const string HttpSeparator = "/";

        public const string X_WWW_From_Urlencoded_Data_Format = "username={0}&password={1}";
        public const string X_WWW_From_Urlencoded_Service = "service={0}";
        public const string UrlParameter_Getting_Authentication_Cookie = "{0}?ticket={1}";
        public const string Header_Key_Location = "Location";
    }
    static class RestResponseStatus
    {
        public  const string Status_Ok = "urn:oasis:names:tc:xacml:1.0:status:ok";
        public const string Status_MissAttributes = "urn:oasis:names:tc:xacml:1.0:status:missing-attribute";
    }
    static class RestResponse
    {
        public  const string Deny = "Deny";
        public  const string Allow = "Permit";
    }
    static class XACML
    {
        public  const string Subject_Access_Subject = "urn:oasis:names:tc:xacml:1.0:subject-category:access-subject";
        public  const string Subject_Subejct_Id = "urn:oasis:names:tc:xacml:1.0:subject:subject-id";
        public  const string Subject_Subject_Name = "urn:oasis:names:tc:xacml:1.0:subject:name";
        public  const string Subject_Prefix = "urn:oasis:names:tc:xacml:1.0:subject:";

        //public const string MycustomAttr_environment_MyCustomAttr = "attribute-category:environment-MyCustomAttr";
        //public const string 

        public const string Host_Host = "urn:nextlabs:names:evalsvc:1.0:attribute-category:host";
        public const string Host_Inet_Address = "urn:nextlabs:names:evalsvc:1.0:host:inet_address";
        public const string Host_Name = "urn:nextlabs:names:evalsvc:1.0:host:name";
        public const string Host_Prefix = "urn:nextlabs:names:evalsvc:1.0:host:";

        public  const string Recipient_Recipient_Subject= "urn:oasis:names:tc:xacml:1.0:subject-category:recipient-subject";
        public  const string Recipient_Id = "urn:nextlabs:names:evalsvc:1.0:recipient:id";
        public  const string Recipient_Name = "urn:nextlabs:names:evalsvc:1.0:recipient::name";
        public  const string Recipient_Prefix = "urn:nextlabs:names:evalsvc:1.0:recipient:";
        public  const string Recipient_Email = "urn:nextlabs:names:evalsvc:1.0:recipient:email";

        public  const string Resource = "urn:oasis:names:tc:xacml:3.0:attribute-category:resource";
        public  const string Resource_Resource_Id = "urn:oasis:names:tc:xacml:1.0:resource:resource-id";
        public  const string Resource_Resource_Type = "urn:nextlabs:names:evalsvc:1.0:resource:resource-type";
        public  const string Resource_Resource_Dimension = "urn:nextlabs:names:evalsvc:1.0:resource:resource-dimension";
        public  const string Resource_Dimension_From = "from";
        public  const string Resource_Dimension_To = "to";
        public  const string Resource_Prefix = "urn:nextlabs:names:evalsvc:1.0:resource:";

        public  const string Action = "urn:oasis:names:tc:xacml:3.0:attribute-category:action";
        public  const string Action_Action_Id = "urn:oasis:names:tc:xacml:1.0:action:action-id";

        public  const string Application = "urn:nextlabs:names:evalsvc:1.0:attribute-category:application";
        public  const string Application_Application_Id = "urn:nextlabs:names:evalsvc:1.0:application:application-id";
        public  const string Application_Application_Name = "urn:nextlabs:names:evalsvc:1.0:application:name";
        public  const string Application_Application_Url = "urn:nextlabs:names:evalsvc:1.0:application:url";
        public  const string Application_Application_Prefix = "urn:nextlabs:names:evalsvc:1.0:application:application:";

        public  const string Environment = "urn:oasis:names:tc:xacml:3.0:attribute-category:environment";
        public  const string Enviroment_Prefix = "urn:oasis:names:tc:xacml:1.0:environment:";
    }   
}
