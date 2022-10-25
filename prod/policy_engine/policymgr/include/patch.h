#ifndef PATCH_H
#define PATCH_H

#include "json/json.h"
#include <map>
#include <vector>
#include <set>
#include "log.h"

typedef uint64_t PID;       /* Policy ID */
typedef uint64_t CID;       /* Component ID */
typedef uint64_t AID;       /* Action ID */
typedef uint64_t PMID;      /* Policy Model ID */

class TalkWithCC;
class PolicyModelList;

class PolicyHelper {
public:
    static bool DownloadPolicys(const std::string& service, const std::string& port, const std::string& user, const std::string& pwd, const std::string& tag,
            std::vector<Json::Value>& rpolicys, PolicyModelList& rsymbols, WriteLog_Fun logf);
private:
    static bool PolicyAnalyzePatch(std::vector<Json::Value>& policy_roots,
            std::map<CID, std::vector<Json::Value *>> &component_patch_list, std::map<AID, std::vector<Json::Value *>> &action_patch_list);

//    static bool ComponentApplyPatch(const std::map<CID, std::vector<Json::Value *>> &component_patch_list, const std::vector<Json::Value>& from_http);
//    static bool ComponentAnalyzePolicyModel(const std::vector<Json::Value>& components, std::set<uint64_t>& pmids);

    // Version 2  , because component contaion membercondition (sub components)
    static bool ComponentApplyPatchV2(const std::map<CID, std::vector<Json::Value *>> &component_patch_list, const std::map<int, Json::Value>& from_http);
    static bool ComponentAnalyzePolicyModelV2(const std::map<int, Json::Value>& components, std::set<uint64_t>& pmids);
    //static bool ComponentPatchForSelf(const std::map<int, Json::Value>& from_http);
};

#endif