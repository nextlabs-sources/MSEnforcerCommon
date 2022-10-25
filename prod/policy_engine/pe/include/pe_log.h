#ifndef LOG_H_2020_11_18
#define LOG_H_2020_11_18
#include <stdio.h>
#include <string>

#include <boost/log/core.hpp>
#include <boost/log/attributes.hpp> 
#include <boost/log/expressions.hpp>
#include <boost/log/trivial.hpp>
#include <boost/log/utility/setup/common_attributes.hpp>
#include <boost/log/support/date_time.hpp>
#include <boost/log/sinks/sync_frontend.hpp>
#include <boost/log/sources/logger.hpp>
#include <boost/log/sources/record_ostream.hpp>
#include <boost/log/sinks/debug_output_backend.hpp>
#include <boost/log/sinks/text_ostream_backend.hpp>
#include <boost/log/sinks/text_file_backend.hpp>
#include <boost/log/utility/setup/console.hpp> // boost::log::add_console_log
#include <boost/log/utility/setup/file.hpp> // boost::log::add_file_log
#include <boost/filesystem.hpp>
#include <boost/log/sinks/async_frontend.hpp>

enum peLogLevel
{
    pe_log_trace = boost::log::trivial::trace,
    pe_log_debug = boost::log::trivial::debug,
    pe_log_info = boost::log::trivial::info,
    pe_log_warning = boost::log::trivial::warning,
    pe_log_error = boost::log::trivial::error,
    pe_log_fatal = boost::log::trivial::fatal
};

class CLog
{
 public:
 static CLog* Instance()
 {
     static CLog* theLog = new CLog();
     return theLog;
 }

 bool InitLog(const std::string& strModuleName);
 int  WriteLog(int lvl, const wchar_t* fmt, ...);
 int  WriteLog(int lvl, const char* fmt, ...);

 void UpdateLogLevel(const std::string& strlevel);

 protected:
 CLog();
 CLog(const CLog&){}

 private:
 std::string GetLogPath();
void WriteLogInternal(int lvl, const char* msg);

 private:
 int m_logLevel;

};

int log_callback(int level, const char* msg);

#define theLog CLog::Instance()

#endif 