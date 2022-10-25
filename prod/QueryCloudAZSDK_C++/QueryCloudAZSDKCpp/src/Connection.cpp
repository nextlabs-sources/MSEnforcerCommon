#include "Connection.h"
#include "PolicyResult.h"
#include "IQueryCloudAZ.h"
#include "QueryCloudAZManager.h"
#include "CommonFun.h"
#include <iostream>
#ifdef WIN32
#include <atlbase.h>
#endif
#include <boost/exception/enable_error_info.hpp>
#include <boost/exception/get_error_info.hpp>
#include <boost/exception/error_info.hpp>

#ifdef WIN32
#define strcasecmp _stricmp
#endif

const std::string JavaPCPDPSuffix = "/dpc/authorization/pdp";
const std::string JavaPCOauthSuffix = "/cas/token";
const std::string Method_Post = "POST";
const std::string Service_Eval = "EVA";
const std::string Service = "Service";
const std::string Version = "Version";
const std::string Authorization = "Authorization";
const std::string Version_1_0 = "1.0";

const std::string StatuQS_S_OK = "urn:oasis:names:tc:xacml:1.0:status:ok";
const std::string Status_MissAttributes = "urn:oasis:names:tc:xacml:1.0:status:missing-attribute";

const std::string PCDeny = "Deny";
const std::string PCAllow = "Permit";

const std::string Subject_Access_Subject = "urn:oasis:names:tc:xacml:1.0:subject-category:access-subject";
const std::string Subject_Subejct_Id = "urn:oasis:names:tc:xacml:1.0:subject:subject-id";
const std::string Subject_Subject_Name = "urn:oasis:names:tc:xacml:1.0:subject:name";
const std::string Subject_Prefix = "urn:oasis:names:tc:xacml:1.0:subject:";

const std::string Host_Host = "urn:nextlabs:names:evalsvc:1.0:attribute-category:host";
const std::string Host_Inet_Address = "urn:nextlabs:names:evalsvc:1.0:host:inet_address";
const std::string Host_Name = "urn:nextlabs:names:evalsvc:1.0:host:name";
const std::string Host_Prefix = "urn:nextlabs:names:evalsvc:1.0:host:";

const std::string Recipient_Recipient_Subject = "urn:oasis:names:tc:xacml:1.0:subject-category:recipient-subject";
const std::string Recipient_Id = "urn:nextlabs:names:evalsvc:1.0:recipient:id";
const std::string Recipient_Name = "urn:nextlabs:names:evalsvc:1.0:recipient::name";
const std::string Recipient_Prefix = "urn:nextlabs:names:evalsvc:1.0:recipient:";
const std::string Recipient_Email = "urn:nextlabs:names:evalsvc:1.0:recipient:email";

const std::string Resource_Resource = "urn:oasis:names:tc:xacml:3.0:attribute-category:resource";
const std::string Resource_Resource_Id = "urn:oasis:names:tc:xacml:1.0:resource:resource-id";
const std::string Resource_Resource_Type = "urn:nextlabs:names:evalsvc:1.0:resource:resource-type";
const std::string Resource_Resource_Dimension = "urn:nextlabs:names:evalsvc:1.0:resource:resource-dimension";
const std::string Resource_Dimension_From = "from";
const std::string Resource_Dimension_To = "to";
const std::string Resource_Prefix = "urn:nextlabs:names:evalsvc:1.0:resource:";

const std::string Action_Action = "urn:oasis:names:tc:xacml:3.0:attribute-category:action";
const std::string Action_Action_Id = "urn:oasis:names:tc:xacml:1.0:action:action-id";

const std::string Application = "urn:nextlabs:names:evalsvc:1.0:attribute-category:application";
const std::string Application_Application_Id = "urn:nextlabs:names:evalsvc:1.0:application:application-id";
const std::string Application_Application_Name = "urn:nextlabs:names:evalsvc:1.0:application:name";
const std::string Application_Application_Url = "urn:nextlabs:names:evalsvc:1.0:application:url";
const std::string Application_Application_Prefix = "urn:nextlabs:names:evalsvc:1.0:application:application:";

const std::string Environment = "urn:oasis:names:tc:xacml:3.0:attribute-category:environment";
const std::string Enviroment_Prefix = "urn:oasis:names:tc:xacml:1.0:environment:";

const std::string Attr_Prop_Name_ID = "AttributeId";
const std::string Attr_Prop_Name_Type = "DataType";
const std::string Attr_Prop_Name_IncludeInRes = "IncludeInResult";
const std::string Attr_Prop_Name_Value = "Value";
const std::string Attr_Prop_Name_CateID = "CategoryId";
const std::string Attr_Prop_Name_Attr = "Attribute";

CloudAZConnection::CloudAZConnection(const std::string& strBaseUrl, const std::string& strPort):
	m_nxlHttpClient(strBaseUrl.c_str(), strPort.c_str())
{
	//InitializeCriticalSection(&m_csHttpClient);

	//m_hMutextClient = NULL; // ::CreateMutex(NULL, false, NULL);
}

void CloudAZConnection::Reset()
{
	//CriticalSectionLock lock(&m_csHttpClient);
    std::lock_guard<std::mutex> sbguard(m_mutex);
	m_nxlHttpClient.Reset();
}


std::string CloudAZConnection::ConstructMultiSubjectToJson(const IPolicyRequest* pRequest, pt::ptree& ptArraySubject)
{
	//find exist action
	const pt::ptree* ptExistSubject = GetExistTreeNode(ptArraySubject, Subject_Subejct_Id.c_str(), pRequest->GetUserSID());
	if (ptExistSubject)
	{
		return ptExistSubject->get<std::string>("Id");
	}
	else
	{
		pt::ptree ptSubject;
		ConstructSubjectToJson(pRequest, ptSubject);

		if (!ptSubject.empty())
		{
			//added id
			std::string strSubjectID = CreateIDForMultiRequest("User", ptArraySubject.size());
			ptSubject.add("Id", strSubjectID.c_str());

			//added to arraysubject
			ptArraySubject.push_back(std::make_pair("", ptSubject));
			return strSubjectID;
		}	
	}

	return "";
}

std::string CloudAZConnection::ConstructMultiHostInfoToJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayCategory)
{
	//find exist action
	const pt::ptree* ptExistHost = GetExistTreeNode(ptArrayCategory, Host_Inet_Address.c_str(), pRequest->GetHostIP());
	if (ptExistHost)
	{
		return ptExistHost->get<std::string>("Id");
	}
	else
	{
		pt::ptree ptHostInfo;
		ConstructHostInfoToJson(pRequest, ptHostInfo);

		if (!ptHostInfo.empty())
		{
			//added id
			std::string strCategoryID = CreateIDForMultiRequest("Category", ptArrayCategory.size());
			ptHostInfo.add("Id", strCategoryID.c_str());

			//added to array
			ptArrayCategory.push_back(std::make_pair("", ptHostInfo));
			return strCategoryID;
		}	
	}

	return "";
}

std::string CloudAZConnection::ConstructMultiAppInfoToJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayCategory)
{
	//find exist action
	const pt::ptree* ptExistApp = GetExistTreeNode(ptArrayCategory, Application_Application_Name.c_str(), pRequest->GetAppName());
	if (ptExistApp)
	{
		return ptExistApp->get<std::string>("Id");
	}
	else
	{
		pt::ptree ptAppInfo;
		ConstructAppInfoToJson(pRequest, ptAppInfo);

		if (!ptAppInfo.empty())
		{
			//added id
			std::string strCategoryID = CreateIDForMultiRequest("Category", ptArrayCategory.size());
			ptAppInfo.add("Id", strCategoryID.c_str());

			//added to array
			ptArrayCategory.push_back(std::make_pair("", ptAppInfo));
			return strCategoryID;
		}	
	}

	return "";
}

std::string CloudAZConnection::ConstructMultiEnvToJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayCategory)
{
	pt::ptree ptEnv;
	ConstructEnvToJson(pRequest, ptEnv);

	if (!ptEnv.empty())
	{
		//added id
		std::string strEnvID = CreateIDForMultiRequest("Category", ptArrayCategory.size());
		ptEnv.add("Id", strEnvID.c_str());

		//added to array
		ptArrayCategory.push_back(std::make_pair("", ptEnv));

		return strEnvID.c_str();
	}

	return "";
}

std::string CloudAZConnection::CreateMultiRequestBody(const IPolicyRequest** pcRequest, int nRequestCount)
{
	//
	pt::ptree ptArrayAction;
	pt::ptree ptArrayCategoryes;
	pt::ptree ptArrayRequest;
	pt::ptree ptArrayResource;
	pt::ptree ptArraySubject;

	//
	for (int i=0; i<nRequestCount; i++)
	{
		pt::ptree ptArrayRefIDs;

		//action
		std::string strActionID = ConstructMultiActionJson(pcRequest[i], ptArrayAction);
		if (!strActionID.empty())
		{
			pt::ptree refAction;
			refAction.put("", strActionID.c_str());
			ptArrayRefIDs.push_back(std::make_pair("", refAction));
		}

		//Resource
		std::string strResourceID = ConstructMultiResourceJson(pcRequest[i], ptArrayResource);
		if (!strResourceID.empty())
		{
			pt::ptree refResource;
			refResource.put("", strResourceID.c_str());
			ptArrayRefIDs.push_back(std::make_pair("", refResource));
		}

		//subject
		std::string strSubjectID = ConstructMultiSubjectToJson(pcRequest[i], ptArraySubject);
		if (!strSubjectID.empty())
		{
			pt::ptree refSubject;
			refSubject.put("", strSubjectID.c_str());
			ptArrayRefIDs.push_back(std::make_pair("", refSubject));
		}

		//host
		std::string strHostID = ConstructMultiHostInfoToJson(pcRequest[i], ptArrayCategoryes);
		if (!strHostID.empty())
		{
			pt::ptree refHost;
			refHost.put("", strHostID.c_str());
			ptArrayRefIDs.push_back(std::make_pair("", refHost));
		}

		//app
		std::string strAppID = ConstructMultiAppInfoToJson(pcRequest[i], ptArrayCategoryes);
		if (!strAppID.empty())
		{
			pt::ptree refApp;
			refApp.put("", strAppID.c_str());
			ptArrayRefIDs.push_back(std::make_pair("", refApp));
		}

		//added environment
		std::string strEnvID = ConstructMultiEnvToJson(pcRequest[i], ptArrayCategoryes);
		if (!strEnvID.empty())
		{
			pt::ptree refEnv;
			refEnv.put("", strEnvID.c_str());
			ptArrayRefIDs.push_back(std::make_pair("", refEnv));
		}

		pt::ptree refRequest;
		refRequest.add_child("ReferenceId", ptArrayRefIDs);

		ptArrayRequest.push_back( std::make_pair("",refRequest) );
	}

	//combine to request
	pt::ptree ptRequest;

	ptRequest.add("CombinedDecision", false);
	ptRequest.add("ReturnPolicyIdList", false);

	if (!ptArrayAction.empty())
	{
		ptRequest.add_child("Action", ptArrayAction);
	}

	if (!ptArrayResource.empty())
	{
		ptRequest.add_child("Resource", ptArrayResource);
	}

	if (!ptArraySubject.empty())
	{
		ptRequest.add_child("Subject", ptArraySubject);
	}

	if (!ptArrayCategoryes.empty())
	{
		ptRequest.add_child("Category", ptArrayCategoryes);
	}

	if (!ptArrayRequest.empty())
	{
		pt::ptree ptRequestRef;
		ptRequestRef.add_child("RequestReference", ptArrayRequest);

		ptRequest.add_child("MultiRequests", ptRequestRef);
	}

	pt::ptree ptMultiRequest;
	ptMultiRequest.add_child("Request", ptRequest);

	//return
	std::stringstream stream;
	pt::write_json(stream, ptMultiRequest);

	return stream.str();
}


std::string CloudAZConnection::CreateIDForMultiRequest(const char* szPrefix, size_t nID)
{
	char szID[100] = { 0 };
    snprintf(szID, sizeof(szID), "%s%zd", szPrefix, nID);
	return szID;
}

std::string CloudAZConnection::ConstructMultiResourceJson(const IPolicyRequest* pRequest, pt::ptree& ptArrayResource)
{
	//find exist action
	const pt::ptree* ptExistResource = GetExistTreeNode(ptArrayResource, Resource_Resource_Id.c_str(), pRequest->GetSourceName());
	if (ptExistResource)
	{
		return ptExistResource->get<std::string>("Id");
	}
	else
	{
		pt::ptree ptResource;
		ConstructSourceToJson(pRequest, ptResource);

		//added id;
		std::string strID = CreateIDForMultiRequest("Resource", ptArrayResource.size());
		ptResource.add("Id", strID.c_str());

		//added to array
		ptArrayResource.push_back(std::make_pair("", ptResource));

		return strID;
	}

}

const pt::ptree* CloudAZConnection::GetExistTreeNode(const pt::ptree& ptTree, const char* AttrID, const char* szValue)
{
	pt::ptree::const_iterator itTree = ptTree.begin();
	while (itTree != ptTree.end())
	{
		//get attribute
		try
		{
			const pt::ptree& ptAttrs = itTree->second.get_child("Attribute");
			pt::ptree::const_iterator itAttrs = ptAttrs.begin();
			while (itAttrs != ptAttrs.end())
			{
				std::string strKey = itAttrs->second.get<std::string>(Attr_Prop_Name_ID);
				
				const pt::ptree& ptValues = itAttrs->second.get_child(Attr_Prop_Name_Value);
				pt::ptree::const_iterator itValue = ptValues.begin();
				std::string strValueExist = itValue->second.get_value<std::string>();
				if (strcasecmp(strKey.c_str(), AttrID)==0 &&
                        strcasecmp(strValueExist.c_str(), szValue)==0 )
				{
					return &(itTree->second);
				}
				

				itAttrs++;
			}
		}
		catch (...)
		{
		}
			
		itTree++;
	}

	return NULL;
}

std::string CloudAZConnection::ConstructMultiActionJson(const IPolicyRequest* pRequest, pt::ptree& refTreeAction)
{
	//
	const char* szAction = pRequest->GetAction();
	if (szAction==NULL || strlen(szAction)==0)
	{
		return "";
	}


	//find exist action
	const pt::ptree* ptExistAction = GetExistTreeNode(refTreeAction, Action_Action_Id.c_str(), pRequest->GetAction());
	if (ptExistAction)
	{
		return ptExistAction->get<std::string>("Id");
	}
	else
	{//create new action node
		
		pt::ptree ptAction;
		ConstructActionToJson(pRequest, ptAction);

		//added id
		std::string strActionID = CreateIDForMultiRequest("Action", refTreeAction.size());
		ptAction.add("Id", strActionID.c_str());

		//added to refTreeAction
		refTreeAction.push_back(std::make_pair("", ptAction)); 

		return strActionID;
/*
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Action_Action_Id);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetAction());
		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		pt::ptree arryAttrs;
		arryAttrs.push_back(std::make_pair("", treeAttr));


		if (!arryAttrs.empty())
		{
			pt::ptree ptAction;
			ptAction.add_child(Attr_Prop_Name_Attr, arryAttrs);
			ptAction.add(Attr_Prop_Name_CateID, Action_Action);

			//construct id
			char szID[10] = { 0 };
			sprintf_s(szID, 10, "Action%zd", refTreeAction.size());
			ptAction.add("Id", szID);

			//put this action to the array
			refTreeAction.push_back(std::make_pair("", ptAction));

			return szID;
		}
		*/
	}

	return "";
}


std::string CloudAZConnection::CreateRequestBody(const IPolicyRequest* ceRequest)
{
	//construct to json
	pt::ptree ptArrayCategoryes;

	//host info
	pt::ptree ptHost;
	ConstructHostInfoToJson(ceRequest, ptHost);
	if (!ptHost.empty())
	{
		ptArrayCategoryes.push_back(std::make_pair("", ptHost));
	}
	

	//subject[user] info
	pt::ptree ptSubject;
	ConstructSubjectToJson(ceRequest, ptSubject);
	if (!ptHost.empty())
	{
		ptArrayCategoryes.push_back(std::make_pair("", ptSubject));
	}

	////source info
	//pt::ptree ptSource;
	//ConstructSourceToJson(ceRequest, ptSource);
	//if (!ptSource.empty())
	//{
	//	ptArrayCategoryes.push_back(std::make_pair("", ptSource));
	//}
	//pt::ptree ptTarget;
	//ConstructTargetToJson(ceRequest, ptTarget);
	//if (!ptTarget.empty())
	//{
	//	ptArrayCategoryes.push_back(std::make_pair("", ptTarget));
	//}

	auto addCategory = [this, &ptArrayCategoryes, ceRequest](ConstructCategoryToJsonMemFn constructToJson) {
		pt::ptree propertyTree;
		//(this->*constructToJson)(ceRequest, propertyTree);
		CALL_MEMBER_FN(this, constructToJson)(ceRequest, propertyTree);
		if (!propertyTree.empty())
		{
			ptArrayCategoryes.push_back(std::make_pair("", propertyTree));
		}
	};
	addCategory(&CloudAZConnection::ConstructSourceToJson);
	addCategory(&CloudAZConnection::ConstructTargetToJson);

	//Action 
	pt::ptree ptAction;
	ConstructActionToJson(ceRequest, ptAction);
	if (!ptAction.empty())
	{
		ptArrayCategoryes.push_back(std::make_pair("", ptAction));
	}
	

	//app info
	pt::ptree ptApp;
	ConstructAppInfoToJson(ceRequest, ptApp);
	if (!ptApp.empty())
	{
		ptArrayCategoryes.push_back(std::make_pair("", ptApp));
	}
	

	//Env
	pt::ptree ptEnv;
	ConstructEnvToJson(ceRequest, ptEnv);
	if (!ptEnv.empty())
	{
		ptArrayCategoryes.push_back(std::make_pair("", ptEnv));
	}

	/*
	//policy-on-demand (POD)
	pt::ptree ptPOD;
	{
		pt::ptree arryAttrs;

		//
		const char* szPQL = "POLICY \"ROOT_128/Joe_Test_Policy\"\n"
			"ATTRIBUTE TRUE_ALLOW\n"
			"FOR TRUE\n"
			"ON VIEW\n"
			"BY TRUE\n"
			"DO DENY\n"
			"ON allow DO  apply_user_filter(\"policy_name\", \"AD_HOC_Policy\", \"field1\", \"city\", \"operator1\", \"is\", \"value1\", \"hangZhou\", \"policy_model_id\", \"70\")\n"
			"ON deny DO apply_user_filter(\"policy_name\", \"AD_HOC_Policy\", \"field1\", \"city\", \"operator1\", \"is\", \"value1\", \"hangZhou\", \"policy_model_id\", \"70\"),log";

		IAttributes* pPodAttr = new Attributes();
		pPodAttr->AddAttribute("urn:nextlabs:names:evalsvc:1.0:pod:pod-id", szPQL, XACML_string);
		pPodAttr->AddAttribute("urn:nextlabs:names:evalsvc:1.0:pod:pod-ignore-built-in", "true", XACML_string);

	    AddCEAttributeToJson(pPodAttr, "", arryAttrs);
	

		if (!arryAttrs.empty())
		{
			ptPOD.add_child(Attr_Prop_Name_Attr, arryAttrs);
			ptPOD.add(Attr_Prop_Name_CateID, "urn:nextlabs:names:evalsvc:1.0:attribute-category:pod");
		}
	}
	if (!ptPOD.empty())
	{
		ptArrayCategoryes.push_back(std::make_pair("", ptPOD));
	}
	*/


	pt::ptree ptNodeCates;
	ptNodeCates.add_child("Category", ptArrayCategoryes);
	ptNodeCates.add("ReturnPolicyIdList", "true");

	pt::ptree ptRequest;
	ptRequest.add_child("Request", ptNodeCates);

	std::stringstream stream;
	pt::write_json(stream, ptRequest);

	return stream.str();
}

void CloudAZConnection::ConstructEnvToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	pt::ptree arryAttrs;

	//
	const IAttributes* pEnvAttr = pRequest->GetEnvironmentAttr();
	if (pEnvAttr && pEnvAttr->Count() > 0)
	{
		AddCEAttributeToJson(pEnvAttr, Enviroment_Prefix, arryAttrs);
	}

	if (!arryAttrs.empty())
	{
		refTreeNode.add_child(Attr_Prop_Name_Attr, arryAttrs);
		refTreeNode.add(Attr_Prop_Name_CateID, Environment);
	}
	
}

#ifdef _RESOURCE_COMPONENT_DEFINED
void CloudAZConnection::ConstructResourceToJson(pt::ptree& refTreeNode, const ResourceComponent * pResource, const std::string& resourceDimension)
{
	//const ResourceComponent * pResource = to ? pRequest->GetTargetResource() : pRequest->GetSourceResource(); //const IPolicyRequest* pRequest;
	if (pResource->name.empty() || pResource->type.empty()) // mandatory attributes
	{
		return;
	}
}
#endif

void CloudAZConnection::ConstructResourceToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode , bool to)
{

	const char* name, *type;
	const IAttributes* pResourceAttr;
	if (to)
	{
		name = pRequest->GetTargetName();
		type = pRequest->GetTargetType();
		pResourceAttr = pRequest->GetTargetAttr();
	} 
	else
	{
		name = pRequest->GetSourceName();
		type = pRequest->GetSourceType();
		pResourceAttr = pRequest->GetSourceAttr();
	}

	if (!strlen(name) || !strlen(type)) // mandatory attributes
	{
		return;
	}

	pt::ptree arryAttrs;

	// urn:oasis:names:tc:xacml:1.0:resource:resource-id
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Resource_Resource_Id);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_AnyURI));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", name);

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	// urn:nextlabs:names:evalsvc:1.0:resource:resource-type
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Resource_Resource_Type);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_AnyURI));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", type);

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	//from or to
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Resource_Resource_Dimension);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_AnyURI));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", to ? Resource_Dimension_To : Resource_Dimension_From);
		//treeValue.put("", resourceDimension);

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}


	// additional attribtues
	if (pResourceAttr && pResourceAttr->Count() > 0)
	{
		AddCEAttributeToJson(pResourceAttr, Resource_Prefix, arryAttrs);
	}

	if (!arryAttrs.empty())
	{
		refTreeNode.add_child(Attr_Prop_Name_Attr, arryAttrs);
		refTreeNode.add(Attr_Prop_Name_CateID, Resource_Resource);
	}
}

void CloudAZConnection::ConstructResourceToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	//ConstructResourceToJson(refTreeNode, pRequest->GetSourceResource(), false);
	//ConstructResourceToJson(refTreeNode, pRequest->GetTargetResource(), true);
	//ConstructResourceToJson(refTreeNode, pRequest->GetSourceResource(), Resource_Dimension_From);
	//ConstructResourceToJson(refTreeNode, pRequest->GetTargetResource(), Resource_Dimension_To);
	ConstructResourceToJson(pRequest, refTreeNode, false);
	ConstructResourceToJson(pRequest, refTreeNode, true);
}

void CloudAZConnection::ConstructSourceToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	//ConstructResourceToJson(refTreeNode, pRequest->GetSourceResource(), false);
	//ConstructResourceToJson(refTreeNode, pRequest->GetSourceResource(), Resource_Dimension_From);
	ConstructResourceToJson(pRequest, refTreeNode, false);
}

void CloudAZConnection::ConstructTargetToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	//ConstructResourceToJson(refTreeNode, pRequest->GetTargetResource(), true);
	//ConstructResourceToJson(refTreeNode, pRequest->GetTargetResource(), Resource_Dimension_To);
	ConstructResourceToJson(pRequest, refTreeNode, true);
}

void CloudAZConnection::ConstructHostInfoToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	pt::ptree arryAttrs;

	if (strlen(pRequest->GetHostName()))
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Host_Name);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetHostName());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	if (strlen(pRequest->GetHostIP()))
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Host_Inet_Address);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_IpAddress));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetHostIP());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	//
	const IAttributes* pHostAttr = pRequest->GetHostAttr();
	if (pHostAttr && pHostAttr->Count() > 0)
	{
		AddCEAttributeToJson(pHostAttr, Host_Prefix, arryAttrs);
	}


	if (!arryAttrs.empty())
	{
		refTreeNode.add_child(Attr_Prop_Name_Attr, arryAttrs);
		refTreeNode.add(Attr_Prop_Name_CateID, Host_Host);
	}

}

void CloudAZConnection::ConstructAppInfoToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	pt::ptree arryAttrs;

	if (strlen(pRequest->GetAppName()))
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Application_Application_Id);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetAppName());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	if (strlen(pRequest->GetAppPath()))
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Application_Application_Name);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetAppPath());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	if (strlen(pRequest->GetAppUrl()))
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Application_Application_Url);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetAppUrl());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}


	//
	const IAttributes* pAppAttr = pRequest->GetAppAttr();
	if (pAppAttr && pAppAttr->Count() > 0)
	{
		AddCEAttributeToJson(pAppAttr, Application_Application_Prefix,  arryAttrs);
	}

	if (!arryAttrs.empty())
	{
		refTreeNode.add_child(Attr_Prop_Name_Attr, arryAttrs);
		refTreeNode.add(Attr_Prop_Name_CateID, Application);
	}
}

void CloudAZConnection::ConstructActionToJson(const IPolicyRequest* pRequest, pt::ptree& refTreeNode)
{
	pt::ptree arryAttrs;

	if (strlen(pRequest->GetAction()))
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Action_Action_Id);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetAction());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}
	
	if (!arryAttrs.empty())
	{
		refTreeNode.add_child(Attr_Prop_Name_Attr, arryAttrs);
		refTreeNode.add(Attr_Prop_Name_CateID, Action_Action);
	}
}

void CloudAZConnection::ConstructSubjectToJson(const IPolicyRequest* pRequest,
	boost::property_tree::ptree& refTreeNode)
{
	pt::ptree arryAttrs;

	//attribute
	if (strlen(pRequest->GetUserSID())>0)
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Subject_Subejct_Id);
    	treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);
		
		pt::ptree treeValue;
		treeValue.put("", pRequest->GetUserSID());
		
		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));
		
		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	if (strlen(pRequest->GetCEUserName())>0)
	{
		pt::ptree treeAttr;

		treeAttr.add(Attr_Prop_Name_ID, Subject_Subject_Name);
		treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(XACML_string));
		treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

		pt::ptree treeValue;
		treeValue.put("", pRequest->GetCEUserName());

		pt::ptree treeValues;
		treeValues.push_back(std::make_pair("", treeValue));

		treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

		arryAttrs.push_back(std::make_pair("", treeAttr));
	}

	//
	const IAttributes* pUserAttr = pRequest->GetUserAttr();
	if (pUserAttr && pUserAttr->Count()>0)
	{
		AddCEAttributeToJson(pUserAttr, Subject_Prefix, arryAttrs);
	}

	if (!arryAttrs.empty())
	{
		refTreeNode.add_child(Attr_Prop_Name_Attr, arryAttrs);
		refTreeNode.add(Attr_Prop_Name_CateID, Subject_Access_Subject);
	}

}

void CloudAZConnection::AddCEAttributeToJson(const IAttributes* pAttr, const std::string& AttrPrefix, pt::ptree& refArrayTree)
{
	const char* pName = NULL;
	const char* pValue = NULL;
	CEAttributeType AttrType;

	//may be there are two attribute with the same name.
	//if that we must combine it.
	std::map<std::string, pt::ptree> mapAttrTree;

	for (unsigned int i=0; i<pAttr->Count(); i++)
	{
		if (pAttr->GetAttrByIndex(i, &pName, &pValue, &AttrType))
		{
			if (pName && pValue)
			{
				std::map<std::string, pt::ptree>::iterator itAttr = mapAttrTree.find(pName);
				if (itAttr != mapAttrTree.end())
				{
					//get old value node
					pt::ptree& treeAttr = itAttr->second;
					pt::ptree& treeValues = treeAttr.get_child(Attr_Prop_Name_Value);

					//add new value
					pt::ptree treeValue;
					treeValue.put("", pValue);
					treeValues.push_back(std::make_pair("", treeValue));
				}
				else
				{
					pt::ptree treeAttr;

					treeAttr.add(Attr_Prop_Name_ID, AttrPrefix + pName);
					treeAttr.add(Attr_Prop_Name_Type, AttributeTypeTostring(AttrType));
					treeAttr.add(Attr_Prop_Name_IncludeInRes, false);

					pt::ptree treeValue;
					treeValue.put("", pValue);

				
					pt::ptree treeValues;
					treeValues.push_back(std::make_pair("", treeValue));

					treeAttr.add_child(Attr_Prop_Name_Value, treeValues);

					//added to map
					mapAttrTree[pName] = treeAttr;
				}
			}
		}
	}

	///added to parent node
	std::map<std::string, pt::ptree>::iterator itAttr = mapAttrTree.begin();
	while (itAttr != mapAttrTree.end())
	{
		refArrayTree.push_back(std::make_pair("", itAttr->second));
		itAttr++;
	}

}

QueryStatus CloudAZConnection::CheckMultiResource(const IPolicyRequest** pcRequest, int nRequestCount, IPolicyResult** pcResult)
{
	QueryCloudAZMgr* pMgr = QueryCloudAZMgr::Instance();

	//construct request body
	std::string strRequestBody = CreateMultiRequestBody(pcRequest, nRequestCount);


	http::request<http::string_body> req{ http::verb::post, "/dpc/authorization/pdp", 11, strRequestBody };

	//set headers
	req.set(http::field::user_agent, "QueryCloudAZ_BoostBeast");
	req.set(http::field::connection, "keep-alive");
	req.set(http::field::content_type, "application/json");
	req.set(http::field::content_length, strRequestBody.length());
	req.set("Service", "EVAL");
	req.set("Version", "1.0");
	req.set("Pragma", "no-cache");

	//add Authorization header
	std::string strToken, strTokenType;
	pMgr->GetToken(strToken, strTokenType);
	if (strToken.empty() || strTokenType.empty())
	{
		return QS_E_Failed;
	}
	req.set("Authorization", (strTokenType + " " + strToken).c_str());

	// This buffer is used for reading and must be persisted
	boost::beast::flat_buffer buffer;
	http::response<http::string_body> res;

	try
	{
        std::lock_guard<std::mutex> sbguard(m_mutex);
		bool bResult = m_nxlHttpClient.Request(req, buffer, res);
        if(!bResult){
            return QS_E_Failed;
        }
	}
	catch (boost::system::system_error const& e) {
#ifdef WIN32
	    OutputDebugStringA(e.what());
#endif
		return QS_E_DisConnect;
	} 
	catch (...)
	{
		return QS_E_Failed;
	}

	if (res.result() == http::status::unauthorized)
	{
		return QS_E_Unauthorized;
	}
	else if (res.result() != http::status::ok)
	{
		return QS_E_Failed;
	}

	//parse
	std::stringstream ss(res.body());
	boost::property_tree::ptree pt;
	try
	{
		boost::property_tree::read_json<boost::property_tree::ptree>(ss, pt);
	}
	catch (...)
	{
		return QS_E_Failed;
	}

	//parse result
	if (!pt.empty())
	{
		//get results
		pt::ptree* ptResults = NULL;
		try
		{
			pt::ptree& ptResponse = pt.get_child("Response");
			pt::ptree::assoc_iterator it = ptResponse.find("Result");
			if (it == ptResponse.not_found())
			{
				ptResults = &ptResponse;
			}
			else
			{
				ptResults = &ptResponse.get_child("Result");
			}
		}
		catch (...)
		{
			return QS_E_InternalError;
		}
		if (ptResults==NULL)
		{
			return QS_E_InternalError;
		}
		

		//parse result
		pt::ptree::iterator itResponse = ptResults->begin();
		int nResponse = 0;
		while (itResponse != ptResults->end())
		{
			PolicyResult* pPolicyResult = new PolicyResult();
			pcResult[nResponse] = dynamic_cast<IPolicyResult*>(pPolicyResult);
			try
			{
				const pt::ptree& ptResponse = itResponse->second;
				QueryStatus qs = ParsePolicyResult(ptResponse, pPolicyResult);
				pPolicyResult->SetQueryStatus(qs);
			}
			catch (...)
			{
				pPolicyResult->SetQueryStatus(QS_E_InternalError);
			}

			itResponse++;
			nResponse++;
		}	
	}

	return QS_S_OK;

}



//this funciton will be called multiplue thread.
//the HttpClient must be locked when send request
QueryStatus CloudAZConnection::CheckSingleResource(const IPolicyRequest* ceRequest, IPolicyResult** pcResult)
{
	std::lock_guard<std::mutex> sbguard(m_mutex);
	QueryCloudAZMgr* pMgr = QueryCloudAZMgr::Instance();
	//construct request body
	std::string strRequestBody = CreateRequestBody(ceRequest);

        QueryCloudAZMgr::Instance()->WriteLog(log_trace, strRequestBody.c_str() );

#if 1
	http::request<http::string_body> req{ http::verb::post, "/dpc/authorization/pdp", 11, strRequestBody };

	//set headers
	req.set(http::field::user_agent, "QueryCloudAZ_BoostBeast");
	req.set(http::field::connection, "keep-alive");
	req.set(http::field::content_type, "application/json");
	req.set(http::field::content_length, strRequestBody.length());
	req.set("Service", "EVAL");
	req.set("Version", "1.0");
	req.set("Pragma", "no-cache");

	//add Authorization header
	std::string strToken, strTokenType;
	pMgr->GetToken(strToken, strTokenType);
	if (strToken.empty() || strTokenType.empty())
	{
		return QS_E_Failed;
	}
	req.set("Authorization", (strTokenType + " " + strToken).c_str());

	// This buffer is used for reading and must be persisted
	boost::beast::flat_buffer buffer;

	// Declare a container to hold the response
	http::response<http::string_body> res;

	try
	{
		//CriticalSectionLock lockHttpClient(&m_csHttpClient);
        
		bool bResult = m_nxlHttpClient.Request(req, buffer, res);
		if((!bResult) || (res.body().empty() )){
                   QueryCloudAZMgr::Instance()->WriteLog(log_warning, "m_nxlHttpClient.Request return false or empty body");
                   return  QS_E_DisConnect;
		}

	  	QueryCloudAZMgr::Instance()->WriteLog(log_trace, res.body().c_str());

	}
	catch (boost::system::system_error const& e) {
#ifdef WIN32
		OutputDebugStringA(e.what());
#endif
        return QS_E_DisConnect;
	}
	catch (...)
	{
		return QS_E_Failed;
	}
	
	if (res.result() == http::status::unauthorized)
	{
		return QS_E_Unauthorized;
	}
	else if (res.result() != http::status::ok)
	{
		return QS_E_Failed;
	}
	
	//parse
	std::stringstream ss(res.body());
	boost::property_tree::ptree pt;
	try
	{
		boost::property_tree::read_json<boost::property_tree::ptree>(ss, pt);
	}
	catch (...)
	{
		return QS_E_Failed;
	}
	
	//parse result
	if (!pt.empty())
	{
		PolicyResult* pPolicyResult = new PolicyResult();
		*pcResult = dynamic_cast<IPolicyResult*>(pPolicyResult);
		try
		{
			const pt::ptree& ptResponse = pt.get_child("Response");
			QueryStatus qs = ParseSinglePolicyResult(ptResponse, pPolicyResult);
			pPolicyResult->SetQueryStatus(qs);
		}
		catch (...)
		{
			pPolicyResult->SetQueryStatus(QS_E_InternalError);
		}
	}
	
#else
	try
	{
		//construct request
		web::http::http_request request(web::http::methods::POST);
		request.set_request_uri(web::http::uri(L"/dpc/authorization/pdp"));
		request.headers().add(L"Connection", "keep-alive");
		request.headers().add(L"User-Agent", "QueryCloudAZcpp");
		request.headers().add(L"Service", "EVAL");
		request.headers().add(L"Version", "1.0");
		request.headers().add(L"Pragma", "no-cache");
		request.set_body(strRequestBody.c_str(), "application/json");

		//set token
		while (true)
		{
			std::string strToken, strTokenType;
			pMgr->GetToken(strToken, strTokenType);
			if (strToken.empty() || strTokenType.empty())
			{
				return QS_E_Failed;
			}
			request.headers().add(L"Authorization", (strTokenType + " " + strToken).c_str());

			{//send request with lock
				//CriticalSectionLock lockHttpClient(&m_csHttpClient);
				DWORD dwBegin = GetTickCount();
				web::http::http_response ServerInforResponse = m_httpClient.request(request).get();
				DWORD dwEnd = GetTickCount();
				printf("TickCount:%d\n", dwEnd - dwBegin);
				if (ServerInforResponse.status_code() == web::http::status_codes::OK)
				{
					jsonValue = ServerInforResponse.extract_json().get();
					break;
				}
				else
				{
					return QS_E_Failed;
				}

				break;
			}
		}


	}
	catch (...)
	{
		return QS_E_Failed;
	}


	//parse result
	if (!jsonValue.is_null())
	{
		PolicyResult* pPolicyResult = new PolicyResult();
		*pcResult = dynamic_cast<IPolicyResult*>(pPolicyResult);
		try
		{
			const web::json::value& jResponse = jsonValue.at(L"Response");
			QueryStatus qs = ParseSinglePolicyResult(jResponse, pPolicyResult);
			pPolicyResult->SetQueryStatus(qs);		
		}
		catch (...)
		{
			pPolicyResult->SetQueryStatus(QS_E_InternalError);
		}	
	}

#endif

	return QS_S_OK;		
}

QueryStatus CloudAZConnection::ParseSinglePolicyResult(const pt::ptree& ptResponse, PolicyResult* pcResult)
{
	try
	{
		//get and parse first result
		pt::ptree ptResultArray;
		pt::ptree::const_assoc_iterator it = ptResponse.find("Result");
		if (it == ptResponse.not_found())
		{
			ptResultArray = ptResponse;
		}
		else
		{
			ptResultArray = ptResponse.get_child("Result");
		}
		const pt::ptree& ptResult = ptResultArray.begin()->second;
		return ParsePolicyResult(ptResult, pcResult);
	}
	catch (...)
	{
	}

	return QS_E_InternalError;
}

#if 0
QueryStatus CloudAZConnection::ParseSinglePolicyResult(const web::json::value& jsonValue, PolicyResult* pcResult)
{
	try
	{
		//get and parse first result
		const web::json::array& jVResArray = jsonValue.at(L"Result").as_array();
		assert(jVResArray.size() == 1);

		const web::json::value& jResult = jVResArray.at(0);
		return ParsePolicyResult(jResult, pcResult);
	}
	catch (...)
	{
	}

	return QS_E_InternalError;
}
#endif 


PolicyEnforcement CloudAZConnection::StringToPolicyResult(const std::string& strRestResponse)
{
	PolicyEnforcement result = DontCare;
	if (strcasecmp(strRestResponse.c_str(),PCDeny.c_str()) == 0 )
	{
		result = Deny;
	}
	else if (strcasecmp(strRestResponse.c_str(), PCAllow.c_str()) == 0 )
	{
		result = Allow;
	}
	return result;
}

QueryStatus CloudAZConnection::GetErrorStatus(const pt::ptree& ptStatus)
{
	try
	{
		const pt::ptree& ptStatusCode = ptStatus.get_child("StatusCode");
		std::string wstrStatusCodeValue = ptStatusCode.get<std::string>("Value");

		if (wstrStatusCodeValue == StatuQS_S_OK)
		{
			return QS_S_OK;
		}
		else if (wstrStatusCodeValue == Status_MissAttributes)
		{
			return QS_E_MissAttributes;
		}
		else
		{
			return QS_E_Failed;
		}
	}
	catch (...)
	{
	}

	return QS_E_InternalError;
}

QueryStatus CloudAZConnection::ParsePolicyResult(const pt::ptree& ptResult, PolicyResult* pcResult)
{
	QueryStatus qs = QS_E_Failed;
	try
	{
		//get enforcement
		std::string strEnforcement = ptResult.get<std::string>("Decision");
		PolicyEnforcement enforcement = StringToPolicyResult(strEnforcement);
		pcResult->SetEnforcement(enforcement);

		//check status
		qs = GetErrorStatus(ptResult.get_child("Status"));
		if (qs != QS_S_OK)
		{
			return qs;
		}


		//get obligations
		const pt::ptree& arrayObligations = ptResult.get_child("Obligations");
		pcResult->ReserveObligation(arrayObligations.size());
		for (auto ptOb = arrayObligations.begin(); ptOb!=arrayObligations.end(); ptOb++)
		{
			Obligation* pOb = new Obligation();
			ParseObligation(ptOb->second, pOb);
			pcResult->AddObligation(pOb);
		}
	}
	catch (...)
	{
		return QS_E_InternalError;
	}

	return QS_S_OK;
}

#if 0
QueryStatus CloudAZConnection::ParsePolicyResult(const web::json::value& jsonValue, PolicyResult* pcResult)
{
	QueryStatus qs = QS_E_Failed;
	try
	{
		//get enforcement
		std::wstring strEnforcement = COMMONFUN::GetStringFromJsonValue(jsonValue, L"Decision");
		PolicyEnforcement enforcement = StringToPolicyResult(strEnforcement);
		pcResult->SetEnforcement(enforcement);

		//check status
		qs = GetErrorStatus(jsonValue.at(L"Status"));
		if (qs!=QS_S_OK)
		{
			return qs;
		}

		
		//get obligations
		const web::json::array& arrayObligations = jsonValue.at(L"Obligations").as_array();
		pcResult->ReserveObligation(arrayObligations.size());
		for (size_t i = 0; i < arrayObligations.size(); i++)
		{
			Obligation* pOb = new Obligation();
			ParseObligation(arrayObligations.at(i), pOb);
			pcResult->AddObligation(pOb);
		}
	}
	catch (...)
	{
		return QS_E_InternalError;
	}	

	return QS_S_OK;
}
#endif 

void CloudAZConnection::ParseObligation(const pt::ptree& ptObligation, Obligation* pOb)
{
	//get name
	std::string strName = ptObligation.get<std::string>("Id");
	pOb->SetName(strName.c_str());

	//get attributes
	Attributes* pAttribures = pOb->GetAttributesInternal();
	const pt::ptree& arrayAttributes = ptObligation.get_child("AttributeAssignment");

	pAttribures->ReserveCount(arrayAttributes.size());
	for (auto pairAttr = arrayAttributes.begin(); pairAttr != arrayAttributes.end(); pairAttr++)
	{
		const pt::ptree& ptAttr = pairAttr->second;
		std::string strName = ptAttr.get<std::string>("AttributeId");
		std::string strType = ptAttr.get<std::string>("DataType");

		//get value
		std::string strValue;
		pt::ptree ptValue = ptAttr.get_child("Value");
		for (auto itValue = ptValue.begin(); itValue!=ptValue.end(); itValue++)
		{
			if (!strValue.empty()){
				strValue += ",";
			}
			strValue += itValue->second.get_value<std::string>();
		}

		pAttribures->AddAttribute(strName.c_str(), strValue.c_str(), XACML_string);
	}
}

std::string CloudAZConnection::AttributeTypeTostring(CEAttributeType ceAttributeType)
{
	std::string strResult;

	if (ceAttributeType == XACML_AnyURI)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#anyURI";
	}
	else if (ceAttributeType == XACML_Base64Binary)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#base64Binary";
	}
	else if (ceAttributeType == XACML_bool)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#bool";
	}
	else if (ceAttributeType == XACML_Date)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#date";
	}
	else if (ceAttributeType == XACML_DateTime)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#dateTime";
	}
	else if (ceAttributeType == XACML_DayTimeDuration)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#dayTimeDuration";
	}
	else if (ceAttributeType == XACML_DnsName)
	{
		strResult = "urn:oasis:names:tc:xacml:2.0:data-type:dnsName";
	}
	else if (ceAttributeType == XACML_Double)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#double";
	}
	else if (ceAttributeType == XACML_HexBinary)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#hexBinary";
	}
	else if (ceAttributeType == XACML_int)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#int";
	}
	else if (ceAttributeType == XACML_IpAddress)
	{
		strResult = "urn:oasis:names:tc:xacml:2.0:data-type:ipAddress";
	}
	else if (ceAttributeType == XACML_Rfc822Name)
	{
		strResult = "urn:oasis:names:tc:xacml:1.0:data-type:rfc822Name";
	}
	else if (ceAttributeType == XACML_string)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#string";
	}
	else if (ceAttributeType == XACML_Time)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#time";
	}
	else if (ceAttributeType == XACML_X500Name)
	{
		strResult = "urn:oasis:names:tc:xacml:1.0:data-type:x500Name";
	}
	else if (ceAttributeType == XACML_XpathExpression)
	{
		strResult = "urn:oasis:names:tc:xacml:3.0:data-type:xpathExpression";
	}
	else if (ceAttributeType == XACML_YearMonthDuration)
	{
		strResult = "http://www.w3.org/2001/XMLSchema#yearMonthDuration";
	}
	else
	{
		strResult = "http://www.w3.org/2001/XMLSchema#string";
	}
	return strResult;
}
