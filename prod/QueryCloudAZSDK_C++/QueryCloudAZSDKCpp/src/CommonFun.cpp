#include "CommonFun.h"
#include <sstream>
#include <iomanip>

#if 0
std::wstring COMMONFUN::GetStringFromJsonValue(const web::json::value& jsonValue, const wchar_t* szName)
{

	try
	{
		const web::json::value& JSValue = jsonValue.at(szName);
		const utility::string_t& str = JSValue.as_string();
		return str;
	}
	catch (web::json::json_exception ex)
	{
		return L"";
	}
}

std::string COMMONFUN::GetAStringFromJsonValue(const web::json::value& jsonValue, const wchar_t* szName)
{
	USES_CONVERSION;
	std::wstring wstr = GetStringFromJsonValue(jsonValue, szName);
	return W2A(wstr.c_str());
}

std::string COMMONFUN::GetAStringFromJsonArray(const web::json::value& jsonValue, const wchar_t* szName)
{
	std::string strValue;
	try
	{

		const web::json::value& jValue = jsonValue.at(szName);
		const web::json::array& array = jValue.as_array();

		USES_CONVERSION;
		for (size_t i = 0; i < array.size(); i++)
		{
			const web::json::value& jItem = array.at(i);

			if (!strValue.empty())
			{
				strValue += ";";
			}

			{strValue += W2A(jItem.as_string().c_str()); }// {} will free the stack space used by W2A
		}
	}
	catch (...)
	{
	}

	return strValue;

}


int COMMONFUN::GetIntFromJsonValue(web::json::value& jsonValue, const wchar_t* szName)
{

	try
	{
		web::json::value JSValue = jsonValue.at(szName);
		int n = JSValue.as_integer();
		return n;
	}
	catch (web::json::json_exception ex)
	{
		return 0;
	}
}

#endif

std::string UrlEncode(const std::string &value)
{
	std::ostringstream escaped;
	escaped.fill('0');
	escaped << std::hex;

	for (std::string::const_iterator i = value.begin(), n = value.end(); i != n; ++i) {
		std::string::value_type c = (*i);

		// Keep alphanumeric and other accepted characters intact
		if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
			escaped << c;
			continue;
		}

		// Any other characters are percent-encoded
		escaped << std::uppercase;
		escaped << '%' << std::setw(2) << int((unsigned char)c);
		escaped << std::nouppercase;
	}

	return escaped.str();
}