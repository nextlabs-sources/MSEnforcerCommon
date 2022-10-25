#pragma once
#include <string>
#include <list>
#include <jni.h>
#include <vector>
#include <string>
using namespace std;

typedef enum EsPath
{
    epPC,
    epSPE,
    epCommon
}EPathType;
typedef enum RmActionType
{
	rmNewRMSObject,
	rmATEncryptTokenGroup,
	rmATEncryptProject,
    rmATUnencrypt,
    rmATReadTag,
    rmATUpdateTag,
    rmATIsNxl
}RmActionType;

class NLCommon
{
public:
    NLCommon();
    ~NLCommon();
public:
    static wstring GetInstallDir(EPathType ept);
    static string ConvertwstringTostring(const wstring& wstr);
	static jstring Wstr2Jstr(JNIEnv *pEnv, const wstring wstrSrc);
	static wstring Jstr2Wstr(JNIEnv *pEnv, const jstring jstrInput);
	static BOOL SafeArrayStringToVector(SAFEARRAY* safeArray, std::vector<std::wstring>& vecData);
};

