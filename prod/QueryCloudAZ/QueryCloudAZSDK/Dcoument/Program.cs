using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using QueryCloudAZSDK;
using QueryCloudAZSDK.CEModel;

namespace QueryCloudAZSDKTester
{
    class Program
    {
        static CERequest CreateQueryRequest(string strAction, string strUrl)
        {
            CERequest obCERequest = new CERequest();

            // Set action info, this is mandatory
            {
                obCERequest.Set_Action(strAction);
            }

            // Set user info, this is mandatory
            {
                CEAttres obCEUserAttres = new CEAttres();
                obCEUserAttres.Add_Attre("City", "HangZhou", CEAttributeType.XACML_String);
                obCEUserAttres.Add_Attre("emailaddress", "george@test.com", CEAttributeType.XACML_String);
                obCERequest.Set_User("S-1-5-21-310440588-250036847-580389505-500", "Test@nextlabs.com", obCEUserAttres);
            }

            // Set source info, this is mandatory
            {
                CEAttres obCESourceAttres = new CEAttres();
                obCESourceAttres.Add_Attre("age", "20", CEAttributeType.XACML_String);
                obCESourceAttres.Add_Attre("url", strUrl, CEAttributeType.XACML_String);
                // Use "spe" as resoure type (must be same with policy mode name) 
                obCERequest.Set_Source(strUrl, "spe", obCESourceAttres);
            }

            // Set Destination info, this is optional
            {
                CEAttres obCEDestAttres = new CEAttres();
                obCEDestAttres.Add_Attre("toattr", "dest", CEAttributeType.XACML_String);
                obCERequest.Set_Dest("C:/Temp/Dest.txt", "spe", obCEDestAttres);
            }

            // Set application info, this is optional
            {
                obCERequest.Set_App("Sharepoint Policy Enforcement", null, null, null);
            }

            // This method can set NameAttributes (Environmental), this is optional
            {
                // You must set this if you want get policy result "Dont Care", it means there are no any policy matched.
                obCERequest.Set_EnvAttributes("dont-care-acceptable", "yes", CEAttributeType.XACML_String);
                // You must set this if you want ignore the policy mode name.
                obCERequest.Set_EnvAttributes("use_resource_type_when_evaluating", "false", CEAttributeType.XACML_String);
            }

            // this method can set host, this is optional
            {
                obCERequest.Set_Host("HostName", "10.23.60.12", null);
            }

            return obCERequest;
        }

        static void Main(string[] args)
        {
            try
            {
                // Establish CEQuery object
                string strJPCHost = "http://cc87-jpc.qapf1.qalab01.nextlabs.com:58080";
                string strOAuthHost = "https://cc87-console.qapf1.qalab01.nextlabs.com";
                string strClientId = "apiclient";
                string strClientSecure = "123blue!";
                CEQuery obCEQuery = new CEQuery(strJPCHost, strOAuthHost, strClientId, strClientSecure);
                if (QueryStatus.E_Unauthorized == obCEQuery.Authenticated)
                {
                    // If occur "E_Unauthorized"，please refresh token again.
                    obCEQuery.RefreshToken();
                }
                if (QueryStatus.S_OK == obCEQuery.Authenticated)
                {
                    List<CERequest> listRequest = new List<CERequest>();
                    List<PolicyResult> results = null;
                    PolicyResult resultSingle = PolicyResult.DontCare;
                    List<QueryCloudAZSDK.CEModel.CEObligation> obSingle = null;
                    List<List<QueryCloudAZSDK.CEModel.CEObligation>> obligations = null;

                    // Create CERequest
                    CERequest requestMy = CreateQueryRequest("OPEN", "Sharepoint://george-sp16/myTestLib/11.docx");
                    CERequest requestYou = CreateQueryRequest("OPEN", "Sharepoint://george-sp16/youTestLib/22.pptx");
                    CERequest requestHe = CreateQueryRequest("OPEN", "Sharepoint://daniel-sp16/heTestLib/33.xlsx");
                    listRequest.Add(requestMy);
                    listRequest.Add(requestYou);
                    listRequest.Add(requestHe);

                    // Do Single Query Policy and get result and obligations
                    QueryStatus statueSingle = obCEQuery.CheckResource(requestMy, out resultSingle, out obSingle);
                    if (statueSingle == QueryStatus.S_OK)
                    {
                        // resultSingle PolicyResult
                        if (resultSingle == PolicyResult.Allow)
                        {
                            Console.WriteLine("CheckResource Policy Result: Access is allowed by policy.");
                            if (obSingle != null && obSingle.Count > 0)
                            {
                                foreach (CEObligation ob in obSingle)
                                {
                                    // obligation information
                                    Console.WriteLine("CheckResource Obligation name: " + ob.Get_Name());
                                    Console.WriteLine("CheckResource Obligation policy name: " + ob.Get_PolicyName());
                                    CEAttres obAttrs = ob.GetCEAttres();
                                    int count = obAttrs.get_count();
                                    for (int i = 0; i < count; i++)
                                    {
                                        string key = "";
                                        string value = "";
                                        CEAttributeType emAttrType = CEAttributeType.XACML_String;
                                        obAttrs.Get_Attre(i, out key, out value, out emAttrType);
                                        Console.WriteLine("CheckResource Obligation attribute, key: " + key);
                                        Console.WriteLine("CheckResource Obligation attribute, value: " + value);
                                        Console.WriteLine("CheckResource Obligation attribute, type: " + emAttrType);
                                    }
                                }
                            }
                        }
                        else if (resultSingle == PolicyResult.Deny)
                        {
                            Console.WriteLine("CheckResource Policy Result: Access is denied by policy.");
                        }
                        else
                        {
                            Console.WriteLine("CheckResource Policy Result: Don't match any policy.");
                        }
                    }
                    QueryStatus statueMultiple = obCEQuery.CheckMultipleResources(listRequest, out results, out obligations);
                    Console.WriteLine("CheckMultipleResources query policy status: " + statueMultiple.ToString());
                    if (statueMultiple == QueryStatus.S_OK)
                    {
                        for (int i = 0; i < results.Count; i++)
                        {
                            Console.WriteLine("CheckMultipleResources index: " + i + ", policy result: " + results[i].ToString());
                            if (results[i] == PolicyResult.Allow)
                            {
                                if (obligations != null && obligations.Count > i && obligations[i] != null && obligations[i].Count > 0)
                                {
                                    // obligation information
                                    foreach (CEObligation ob in obligations[i])
                                    {
                                        Console.WriteLine("CheckMultipleResources Obligation name: " + ob.Get_Name());
                                        Console.WriteLine("CheckMultipleResources Obligation policy name: " + ob.Get_PolicyName());
                                        CEAttres obAttrs = ob.GetCEAttres();
                                        int count = obAttrs.get_count();
                                        for (int j = 0; j < count; j++)
                                        {
                                            string key = "";
                                            string value = "";
                                            CEAttributeType emAttrType = CEAttributeType.XACML_String;
                                            obAttrs.Get_Attre(j, out key, out value, out emAttrType);
                                            Console.WriteLine("CheckMultipleResources Obligation attribute, key: " + key);
                                            Console.WriteLine("CheckMultipleResources Obligation attribute, value: " + value);
                                            Console.WriteLine("CheckMultipleResources Obligation attribute, type: " + emAttrType);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    Console.WriteLine(string.Format("Establish CEQuery object failed: [{0}]\n", obCEQuery.Authenticated));
                }
            }
            catch(Exception exp)
            {
                Console.WriteLine("Main Exception: " + exp);
            }
            Console.ReadLine();
        }
    }
}