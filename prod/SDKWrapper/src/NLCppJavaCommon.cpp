#include "stdafx.h"
#include "NLCppJavaCommon.h"
#include <set>
#define Max_Len 1024
#include "nlofficerep_only_debug.h"
#include "common_tools.h"


NLCppJavaCommon::NLCppJavaCommon()
{
	m_bRMCfgSetOuter = false;
    m_bInitialized = false;
    m_pJavaVM = NULL;
 
	wstring wstrClassPath = L"-Djava.class.path=.;";
	m_wstrCommonDir = NLCommon::GetInstallDir(epCommon);
	if (!m_wstrCommonDir.empty())
	{
		const wchar_t* ClassPath[] = { L"jars\\rmjavasdk-ng.jar;",
			L"jars\\shared.jar;",
			L"jars\\log4j-api-2.10.0.jar;",
			L"jars\\log4j-core-2.10.0.jar;",
			L"jars\\gson-2.3.1.jar;",
			L"jars\\bcprov-jdk15on-1.57.jar;",
			L"jars\\commons-codec-1.10.jar;" };

		for (int i = 0; i < sizeof(ClassPath) / sizeof(ClassPath[0]); i++)
		{
			wstrClassPath.append(m_wstrCommonDir + ClassPath[i]);
		}
	}
	else
	{
		NLPrintLogW(true, L"NLCommon::GetInstallDir(epCommon) failed.\n");
		return ;
	}

	string classPath = NLCommon::ConvertwstringTostring(wstrClassPath);

	const char* wzClassPath = classPath.c_str();
	char* chPath = new char[strlen(wzClassPath) + 1]();
	strncpy_s(chPath, strlen(wzClassPath) + 1, wzClassPath, strlen(wzClassPath) + 1);
	m_jvmOptions[0].optionString = chPath;
	//JvmOptions[1].optionString = "-Djava.compiler=NONE"; //Disabled JIT
	//JvmOptions[2].optionString = "-verbose:NONE";
	m_jvmArgs.version = JNI_VERSION_1_8;
	m_jvmArgs.nOptions = 1;
	m_jvmArgs.options = m_jvmOptions;
	m_jvmArgs.ignoreUnrecognized = false;

}

NLCppJavaCommon::~NLCppJavaCommon()
{
    FinalizeRMJavaSDK();
}

NLCppJavaCommon& NLCppJavaCommon::GetInstance()
{
    static NLCppJavaCommon theInstance;
    return theInstance;
}

bool NLCppJavaCommon::CheckInit()
{
    if (!m_bInitialized)
    {
        InitializeRMJavaSDK();
    }
    return m_bInitialized;
}

bool NLCppJavaCommon::InitializeRMJavaSDK()
{
    if (!m_bInitialized)
    {  
        jint rc = JNI_EINVAL;       

		wstring jvmLib = GetNewestJVMFilePath();
        HINSTANCE hInstance = ::LoadLibraryW(jvmLib.c_str());
        if (hInstance != NULL)
        {
            PFunCreateJavaVM funCreateJavaVM = (PFunCreateJavaVM)::GetProcAddress(hInstance, "JNI_CreateJavaVM");
            if (funCreateJavaVM != NULL)
			{
				JNIEnv* pJEnv = NULL;
				rc = (*funCreateJavaVM)(&m_pJavaVM, (void**)&pJEnv, &m_jvmArgs);
				if ((rc == JNI_EEXIST) || (rc == JNI_OK))
				{
					if (rc == JNI_EEXIST)
					{
						PFunGetCreatedJavaVMs funGetVM = (PFunGetCreatedJavaVMs)::GetProcAddress(hInstance, "JNI_GetCreatedJavaVMs");
						if (funGetVM)
						{
							const jsize nVm = 1;
							JavaVM* JVMS[nVm] = { NULL };
							jsize nVmed = 0;
							rc = funGetVM(JVMS, nVm, &nVmed);

							if (JVMS[0])
							{
								m_pJavaVM = JVMS[0];
							}
						}

						pJEnv = GetJavaEnv();
						if (pJEnv == NULL)
						{
							return false;
						}

					}

					if (NLInitJavaCommonFunctions(pJEnv))
					{
						if (NLInitNLJavaSDKFunctions(pJEnv))
						{
							m_bInitialized = true;
						}
						else
						{
							NLPrintLogW(g_kbOutputDebugLog, L"InitializeRMJavaSDK: Failed to init JavaRMSDK functions.");
						}
					}
					else
					{
						NLPrintLogW(g_kbOutputDebugLog, L"InitializeRMJavaSDK: Failed to init Java common functions.");
					}
				}
				else
				{
					NLPrintLogW(g_kbOutputDebugLog, L"InitializeRMJavaSDK: Failed to create Java VM. rc=%d", rc);
				}
			}
        }
		else
		{
			NLPrintLogW(true, L"Load Jvm.dll failed. lasterror=%d", GetLastError() );
		}
    }
    if (!m_bInitialized)
    {
        NLPrintLogW(true, L"Failed to init RMS Java environment!");
    }
    else
    {
        NLPrintLogW(true, L"Init RMS Java environment successfully!");
    }
    return m_bInitialized;
}


bool NLCppJavaCommon::FinalizeRMJavaSDK()
{
    bool bRet = true;
    if (m_pJavaVM != NULL && m_bInitialized)
	{
		//here we didn't destroyJVM because this function must be called in thread that call cratejvm
      //  m_pJavaVM->DestroyJavaVM();
      //  m_pJavaVM = NULL;
	}
    return bRet;
}

jstring NLCppJavaCommon::ComposeBstr2JObj(JNIEnv* pJEnv,BSTR bstrInput)
{
    if(bstrInput == NULL || bstrInput[0] == L'\0')
    {
        return NULL;
    }
    char* pInPath = _com_util::ConvertBSTRToString(bstrInput);

	jstring jstr = pJEnv->NewStringUTF(pInPath);

	delete[] pInPath; // the result of ConvertBSTRToString must be deleted
	pInPath = NULL;

	return jstr;
}

// This tags is care-sensitive.
jobject NLCppJavaCommon::ComposeStrVector2JMap(JNIEnv* pJEnv, vector<wstring> vecName, vector<wstring> vecValue)
{
    size_t nName = vecName.size();
    size_t nValue = vecValue.size();
	if (nName == 0)
	{
		NLPrintLogW(g_kbOutputDebugLog, L"ComposeStrVector2JMap: tags is empty.");
		return NULL;
	}
    jobject joHM = pJEnv->NewObject(m_JHashMap.sJCHMclass, m_JHashMap.sJCHMinit, "");
    if (joHM != NULL && nName > 0 && nName == nValue)
    {
        set<wstring> setKeys;
        for (ULONG i = 0; i < nName; ++i)
        {
            jobject joAL = pJEnv->NewObject(m_JArrayList.sJCALclass, m_JArrayList.sJCALinit, "");
            wstring wstrName = vecName[i];
            if (!wstrName.empty())
            {
                set<wstring>::iterator iter = setKeys.find(wstrName);
                if (iter == setKeys.end())
                {
                    setKeys.insert(wstrName);
                    wstring wstrValue = vecValue[i];
                    //put elements to java list object
					
					pJEnv->CallObjectMethod(joAL, m_JArrayList.sJCALadd, NLCommon::Wstr2Jstr(pJEnv, wstrValue));
                    for (ULONG j = i + 1; j < nName; ++j)
                    {
                        wstring wstrNextName = vecName[j];
                        if (!wstrNextName.empty() && wstrNextName == wstrName)
                        {
                            wstring wstrNextValue = vecValue[j];
							pJEnv->CallObjectMethod(joAL, m_JArrayList.sJCALadd, NLCommon::Wstr2Jstr(pJEnv,wstrNextValue));
                        }
                    }
					pJEnv->CallObjectMethod(joHM, m_JHashMap.sJCHMput, NLCommon::Wstr2Jstr(pJEnv,wstrName), joAL);
                }
            }
        }
    }

    return joHM;
}

void NLCppJavaCommon::ComposeJMap2StrVector(JNIEnv* pJEnv, jobject jMaptag, vector<wstring>& vecName, vector<wstring>& vecValue)
{
    jobject jsetKey = pJEnv->CallObjectMethod(jMaptag, m_JHashMap.sJCHMkeySet);
    jobjectArray jarrayKey = (jobjectArray)pJEnv->CallObjectMethod(jsetKey, m_JSet.sJSETtoArray);
    if (jarrayKey != NULL)
    {
        int nKey = (int)pJEnv->GetArrayLength(jarrayKey);
        int i = 0;
        for (i = 0; i < nKey; i++)
        {
            wstring wstrKey = L"";
            wstring wstrValue = L"";

            jstring jstrkey = (jstring)pJEnv->GetObjectArrayElement(jarrayKey, i);
            jobject jlistValue = pJEnv->CallObjectMethod(jMaptag, m_JHashMap.sJCHMget, jstrkey);
			wstrKey = NLCommon::Jstr2Wstr(pJEnv, jstrkey);
            jobjectArray jarrayValue = (jobjectArray)jlistValue;
            if (jarrayValue != NULL)
            {
                int nValue = (int)pJEnv->GetArrayLength(jarrayValue);
                int j = 0;
                for (j = 0; j < nValue; j++)
                {
                    jstring jstrValue = (jstring)pJEnv->GetObjectArrayElement(jarrayValue, j);
					wstrValue = NLCommon::Jstr2Wstr(pJEnv, jstrValue);
                    vecName.push_back(wstrKey);
                    vecValue.push_back(wstrValue);
                }
            }
        }
    }
}

jobject NLCppJavaCommon::ExecuteJavaAPI(JNIEnv* pJEnv,jobject joRMS, RmActionType rmAct, jstring jstrPathIn,
	jstring jstrPathOut, jobject joAttrs, jobject joTags, jobject joRights,
	jstring jstrRouteUrl, jint appID, jstring jstrAppKey, int nTokenGroupType, jstring jstrProject)
{
    jobject bRet = NULL;
    jstring jstrId = pJEnv->NewStringUTF("");
    switch (rmAct)
    {
	    case rmNewRMSObject:
	        {
			   bRet = pJEnv->NewObject(m_JRightsManager.sJRMclass, m_JRightsManager.sJRMinit,
				  jstrRouteUrl, appID, jstrAppKey);
			 
	        }
	        break;
        case rmATEncryptTokenGroup:
		{
			//convert token group type
			jobject jTokenGroupType = m_TokenGroupType.tokenGroupSystemBucket;
			if (nTokenGroupType==1)
			{
				jTokenGroupType = m_TokenGroupType.tokenGroupTenant;
			}
			else if (nTokenGroupType==2)
			{
				jTokenGroupType = m_TokenGroupType.tokenGroupProject;
			}

				//manager.encrypt(inputFile, outputFile, null, rights, tagMap, tenantName);
               bRet = pJEnv->CallObjectMethod(joRMS, m_JRightsManager.sJRMencryptTokenGroup,
					jstrPathIn, 
					jstrPathOut, 
					joAttrs,
					joRights,
					joTags, 
				    NULL, jTokenGroupType);
            }
            break;
		case rmATEncryptProject:
		{
			//manager.encrypt(inputFile, outputFile, null, rights, tagMap, tenantName);
			bRet = pJEnv->CallObjectMethod(joRMS, m_JRightsManager.sJRMencryptProject,
				jstrPathIn,
				jstrPathOut,
				joAttrs,
				joRights,
				joTags,
				NULL, jstrProject);
		}
		break;
        case rmATUnencrypt:
            {
                bRet = pJEnv->CallObjectMethod(joRMS, m_JRightsManager.sJRMdecrypt, jstrPathIn, jstrPathOut, jstrId);
            }
            break;
        case rmATReadTag:
            {
                bRet = pJEnv->CallObjectMethod(joRMS, m_JRightsManager.sJRMreadtags, jstrPathIn, jstrProject);
            }
            break;
        case rmATUpdateTag:
            {
			pJEnv->CallObjectMethod(joRMS, m_JRightsManager.sJRMupdatetags, joTags, jstrPathIn, jstrId);
            }
            break;
        case rmATIsNxl:
            {
                bRet = pJEnv->CallObjectMethod(joRMS, m_JRightsManager.sJRMisnxl, jstrPathIn);
            }
            break;
        default:
            break;
    }

    return bRet;
}
 
bool NLCppJavaCommon::NLInitNLJavaSDKFunctions(JNIEnv* pJEnv)
{
    bool bRet = false;

	//int token group enum
	m_TokenGroupType.enumTokenGroupType = pJEnv->FindClass("com/nextlabs/common/shared/Constants$TokenGroupType");
	if (m_TokenGroupType.enumTokenGroupType!=NULL)
	{
		jfieldID fieldSystemBucket= pJEnv->GetStaticFieldID(m_TokenGroupType.enumTokenGroupType, 
			"TOKENGROUP_SYSTEMBUCKET", "Lcom/nextlabs/common/shared/Constants$TokenGroupType;");
		if (fieldSystemBucket!=NULL)
		{
			m_TokenGroupType.tokenGroupSystemBucket =  pJEnv->GetStaticObjectField(m_TokenGroupType.enumTokenGroupType,
				fieldSystemBucket);
		}

		jfieldID fieldTenant = pJEnv->GetStaticFieldID(m_TokenGroupType.enumTokenGroupType,
			"TOKENGROUP_TENANT", "Lcom/nextlabs/common/shared/Constants$TokenGroupType;");
		if (fieldTenant!=NULL)
		{
			m_TokenGroupType.tokenGroupTenant = pJEnv->GetStaticObjectField(m_TokenGroupType.enumTokenGroupType,
				fieldTenant);
		}

		jfieldID  fieldProject = pJEnv->GetStaticFieldID(m_TokenGroupType.enumTokenGroupType,
			"TOKENGROUP_PROJECT", "Lcom/nextlabs/common/shared/Constants$TokenGroupType;");
		if (fieldProject!=NULL)
		{
			m_TokenGroupType.tokenGroupProject = pJEnv->GetStaticObjectField(m_TokenGroupType.enumTokenGroupType,
				fieldProject);
		}
	}

    //init Nxl RightsManagement related functions
    m_JRightsManager.sJRMclass = pJEnv->FindClass("com/nextlabs/nxl/RightsManager");
    if (m_JRightsManager.sJRMclass != NULL)
    {
        m_JRightsManager.sJRMinit = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "<init>", "(Ljava/lang/String;ILjava/lang/String;)V");
        m_JRightsManager.sJRMencryptTokenGroup = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "encrypt", "(Ljava/lang/String;Ljava/lang/String;Ljava/util/Map;[Lcom/nextlabs/nxl/Rights;Ljava/util/Map;Ljava/lang/String;Lcom/nextlabs/common/shared/Constants$TokenGroupType;)V");
		m_JRightsManager.sJRMencryptProject =    pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "encrypt", "(Ljava/lang/String;Ljava/lang/String;Ljava/util/Map;[Lcom/nextlabs/nxl/Rights;Ljava/util/Map;Ljava/lang/String;Ljava/lang/String;)V");
		m_JRightsManager.sJRMdecrypt = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "decrypt", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/nextlabs/common/shared/Constants$TokenGroupType;)V");
        m_JRightsManager.sJRMisnxl = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "isNXL", "(Ljava/lang/String;)Z");
        m_JRightsManager.sJRMreadtags = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "readTags", "(Ljava/lang/String;)Ljava/util/Map;");
        m_JRightsManager.sJRMupdatetags = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "updateTags", "(Ljava/lang/String;Ljava/util/Map;Ljava/lang/String;Lcom/nextlabs/common/shared/Constants$TokenGroupType;Ljava/lang/String;)V");
        m_JRightsManager.sJRMcleanup = pJEnv->GetMethodID(m_JRightsManager.sJRMclass, "cleanup", "()V");
        
        if (m_JRightsManager.sJRMinit != NULL && m_JRightsManager.sJRMencryptTokenGroup != NULL && m_JRightsManager.sJRMdecrypt != NULL 
            && m_JRightsManager.sJRMisnxl != NULL && m_JRightsManager.sJRMreadtags != NULL && m_JRightsManager.sJRMupdatetags != NULL)
        {
            bRet = true;
        }
    }


	char szLog[1024] = { 0 };
	sprintf(szLog, "sJRMinit=%p,sJRMencrypt=%p,sJRMdecrypt=%p,sJRMisnxl=%p,sJRMreadtags=%p, sJRMupdatetags=%p",
		m_JRightsManager.sJRMinit, m_JRightsManager.sJRMencryptTokenGroup, m_JRightsManager.sJRMdecrypt,
		m_JRightsManager.sJRMisnxl, m_JRightsManager.sJRMreadtags, m_JRightsManager.sJRMupdatetags
	);
	::OutputDebugStringA(szLog);



    return bRet;        
}

JNIEnv* NLCppJavaCommon::GetJavaEnv()
{
	JNIEnv* pEnv = NULL;

	if (m_pJavaVM)
	{
		m_pJavaVM->AttachCurrentThread((void**)&pEnv, &m_jvmArgs);
	}

	if (pEnv==NULL)
	{
		NLPrintLogW(true, L"GetJavaEnv failed.\n");
	}

	return pEnv;
}

bool NLCppJavaCommon::NLInitJavaCommonFunctions(JNIEnv* pJEnv)
{
    bool bRet = false;
    //init ArrayList related functions
    m_JArrayList.sJCALclass = pJEnv->FindClass("java/util/ArrayList");
    if (m_JArrayList.sJCALclass != NULL)
    {
        m_JArrayList.sJCALinit = pJEnv->GetMethodID(m_JArrayList.sJCALclass, "<init>", "()V");
        m_JArrayList.sJCALadd = pJEnv->GetMethodID(m_JArrayList.sJCALclass, "add", "(Ljava/lang/Object;)Z");
        m_JArrayList.sJCALclear = pJEnv->GetMethodID(m_JArrayList.sJCALclass, "clear", "()V");
        m_JArrayList.sJCALtoArray = pJEnv->GetMethodID(m_JArrayList.sJCALclass, "toArray", "()[Ljava/lang/Object;");
        if (m_JArrayList.sJCALinit != NULL && m_JArrayList.sJCALadd != NULL && m_JArrayList.sJCALclear != NULL && m_JArrayList.sJCALtoArray != NULL)
        {
            bRet = true;
        }
    }

    //init HashMap related functions
    m_JHashMap.sJCHMclass = pJEnv->FindClass("java/util/HashMap");
    if (m_JHashMap.sJCHMclass != NULL && bRet)
    {
        m_JHashMap.sJCHMinit = pJEnv->GetMethodID(m_JHashMap.sJCHMclass, "<init>", "()V");
        m_JHashMap.sJCHMput = pJEnv->GetMethodID(m_JHashMap.sJCHMclass, "put", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
        m_JHashMap.sJCHMsize = pJEnv->GetMethodID(m_JHashMap.sJCHMclass, "size", "()I");
        m_JHashMap.sJCHMkeySet = pJEnv->GetMethodID(m_JHashMap.sJCHMclass, "keySet", "()Ljava/util/Set;");
        m_JHashMap.sJCHMget = pJEnv->GetMethodID(m_JHashMap.sJCHMclass, "get", "(Ljava/lang/Object;)Ljava/lang/Object;");
        if (m_JHashMap.sJCHMinit == NULL || m_JHashMap.sJCHMput == NULL || m_JHashMap.sJCHMsize == NULL || m_JHashMap.sJCHMkeySet == NULL || m_JHashMap.sJCHMget == NULL)
        {
            bRet = false;
        }
    }

    //init Set related functions
    m_JSet.sJCSETclass = pJEnv->FindClass("java/util/HashSet");
    if (m_JSet.sJCSETclass != NULL && bRet)
    {
        m_JSet.sJSETinit = pJEnv->GetMethodID(m_JSet.sJCSETclass, "<init>", "()V");
        m_JSet.sJSETtoArray = pJEnv->GetMethodID(m_JSet.sJCSETclass, "toArray", "()[Ljava/lang/Object;");
        if (m_JSet.sJSETinit == NULL || m_JSet.sJSETtoArray == NULL)
        {
            bRet = false;
        }
    }

    return bRet;
}
