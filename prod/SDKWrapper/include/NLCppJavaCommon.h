#pragma once
#include <string>
#include <jni.h>
//#include "atlsafe.h"
#include "comutil.h"
#include "NLCommon.h"
#include <vector>

using namespace std;
//using namespace ATL;

#ifdef _DEBUG
# pragma comment(lib, "comsuppwd.lib")
#else
# pragma comment(lib, "comsuppw.lib")
#endif
# pragma comment(lib, "wbemuuid.lib")

typedef jint(WINAPI *PFunCreateJavaVM)(JavaVM **, void **, void *);
typedef jint (WINAPI *PFunGetCreatedJavaVMs)(JavaVM **vmBuf, jsize bufLen, jsize *nVMs);

typedef struct JavaClsArrayList
{
    jclass sJCALclass;
    jmethodID sJCALinit;
    jmethodID sJCALadd;
    jmethodID sJCALtoArray;
    jmethodID sJCALclear;
}StructJavaArrayListType;

typedef struct JavaClsHashMap
{
    jclass sJCHMclass;
    jmethodID sJCHMinit;
    jmethodID sJCHMsize;
    jmethodID sJCHMkeySet;
    jmethodID sJCHMget;
    jmethodID sJCHMput;
}StructJavaHashMapType;

typedef struct JavaClsSet
{
    jclass sJCSETclass;
    jmethodID sJSETinit;
    jmethodID sJSETtoArray;
}StructJavaSetType;


typedef struct JavaRightsManager
{
    jclass sJRMclass;
    jmethodID sJRMinit;
    jmethodID sJRMencryptTokenGroup;
	jmethodID sJRMencryptProject;
    jmethodID sJRMdecrypt;
    jmethodID sJRMreadtags;
    jmethodID sJRMupdatetags;
    jmethodID sJRMisnxl;
    jmethodID sJRMcleanup; //cleanup (Deprecated)
}RightsManagerMethod;

typedef struct tagTokenGroupType
{
	jclass enumTokenGroupType;
	jobject tokenGroupSystemBucket;
	jobject tokenGroupTenant;
	jobject tokenGroupProject;
}JavaEnumTokenGroupType;


typedef struct RightManagerPara
{
	 jstring  jstrRouterUrl;
	 jstring  jstrAppKey;
	int nAppID;
}RightManagerPara;

class NLCppJavaCommon
{
public: 
	~NLCppJavaCommon();
    static NLCppJavaCommon& GetInstance();
    bool CheckInit();
public:
    jstring ComposeBstr2JObj(JNIEnv* pJEnv,BSTR bstrInput);
    jobject ComposeStrVector2JMap(JNIEnv* pJEnv, vector<wstring> vecName, vector<wstring> vecValue);
    void ComposeJMap2StrVector(JNIEnv* pJEnv, jobject jmapTag, vector<wstring>& vecName, vector<wstring>& vecValue);
    jobject ExecuteJavaAPI(JNIEnv* pJEnv, jobject joRMS, RmActionType rmAct, jstring jstrPathIn, jstring jstrPathOut,
		jobject joAttrs, jobject joTags, jobject joRights,
		jstring jstrRouteUrl, jint appID, jstring appKey, int tokenGroupType, jstring jstrProject);
	JNIEnv* GetJavaEnv();
private:
    NLCppJavaCommon();

private:
    bool InitializeRMJavaSDK();
    bool FinalizeRMJavaSDK();
    bool NLInitNLJavaSDKFunctions(JNIEnv* pJEnv);
    bool NLInitJavaCommonFunctions(JNIEnv* pJEnv);
private: 
    bool m_bInitialized;
	JavaVMInitArgs m_jvmArgs;
	JavaVMOption m_jvmOptions[1];
    JavaVM* m_pJavaVM;
 
	std::wstring m_wstrCommonDir;

    StructJavaArrayListType m_JArrayList;
    StructJavaHashMapType m_JHashMap;
    StructJavaSetType m_JSet;
	bool m_bRMCfgSetOuter;
  
	RightsManagerMethod m_JRightsManager;
	JavaEnumTokenGroupType m_TokenGroupType;

};
