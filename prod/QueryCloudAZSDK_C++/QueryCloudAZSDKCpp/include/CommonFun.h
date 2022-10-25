#ifndef COMMON_FUN_H
#define COMMON_FUN_H

#include <string>
#ifdef WIN32
#include <atlbase.h>
#endif

/*
namespace COMMONFUN
{

	std::wstring GetStringFromJsonValue(const web::json::value& jsonValue, const wchar_t* szName);

	std::string GetAStringFromJsonValue(const web::json::value& jsonValue, const wchar_t* szName);

	std::string GetAStringFromJsonArray(const web::json::value& jsonValue, const wchar_t* szName);
	
	int GetIntFromJsonValue(web::json::value& jsonValue, const wchar_t* szName);

};
*/

std::string UrlEncode(const std::string &value);

#endif 
