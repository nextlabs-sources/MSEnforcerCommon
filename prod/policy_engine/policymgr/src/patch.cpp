#include "patch.h"
#include "TalkWithCC.h"
#include "PolicyModelList.h"
#include "policy_analyze.h"

#define KEY_ACTION_COMPONENTS           "actionComponents"
#define KEY_SUBJECT_COMPONENTS          "subjectComponents"
#define KEY_FROM_RESOURCE_COMPONENTS    "fromResourceComponents"
#define KEY_COMPONENTS                  "components"
#define KEY_ID                          "id"
#define KEY_ACTIONS                     "actions"
#define KEY_CONDITIONS                  "conditions"
#define KEY_POLICY_MODEL_ID             "policy_model_id"
#define KEY_TYPE                        "type"
#define KEY_CONDITIONS                  "conditions"
#define KEY_ATTRIBUTE                   "attribute"
#define KEY_ATTRIBUTE_TYPE              "attribute_type"

void get_component_recursion(TalkWithCC *talk ,int id, std::map<int, Json::Value> & contents){
    std::string jstr;
    bool r = talk->SearchComponentByID(std::to_string(id), jstr);
    if (!r) return;
    Json::Value value;
    std::vector<int> subid;
    get_component_jsvalue_from_string(jstr, value, subid); //   subject / resource
    contents.insert(std::make_pair(id,value));

    for(auto it_id: subid){
        if(contents.find(it_id) == contents.end()) {
            get_component_recursion(talk, it_id, contents);
        }
    }

}

void get_action_component_recursion(TalkWithCC *talk ,int id, std::map<int, Json::Value> & contents){
    std::string jstr;
    bool r = talk->SearchComponentByID(std::to_string(id), jstr);
    if (!r) return;
    Json::Value value;
    std::vector<int> subid;
    get_component_jsvalue_from_string(jstr, value, subid,true);  // action
    contents.insert(std::make_pair(id,value));

    for(auto it_id: subid){
        if(contents.find(it_id) == contents.end()) {
            get_action_component_recursion(talk, it_id, contents);
        }
    }

}

bool PolicyHelper::DownloadPolicys(const std::string& service, const std::string& port, const std::string& user, const std::string& pwd, const std::string& tag,
                     std::vector<Json::Value>& rpolicys, PolicyModelList& rsymbols, WriteLog_Fun logf) {
    if(Log::m_logFun ==NULL && logf != NULL) {
        Log::m_logFun = logf;
    }
	NXLHttpClient *phttp_client = new NXLHttpClient(service.c_str(), port.c_str());
	// TODO std::unique_ptr<TalkWithCC> talk = std::make_unique<TalkWithCC202004>(phttp_client, user, pwd);
	TalkWithCC *talk = new TalkWithCC202004(phttp_client, user, pwd);
    // TalkWithCC *talk = TalkWithCC::MakeTalk(service, port, user, pwd);
    if (talk == nullptr) return false;
	if(!talk->LoginToCAS()) {
		delete (talk);
		talk = nullptr;
		return false;
	}
    std::vector<std::string> pids;
    bool r = talk->SearchPolicyIDsByTag(tag, pids);
    if (!r) {
        delete (talk);
        return false;
    }
    std::vector<Json::Value> policys;
    for (auto it : pids) {
        std::string jstr;
        r = talk->SearchPolicyByID(it, jstr);
        assert(r);
        Json::Value value ;
        get_policy_jsvalue_from_string(jstr, value);
        policys.push_back(value);
    }

    std::map<CID, std::vector<Json::Value *>> component_patch_list;
    std::map<AID, std::vector<Json::Value *>> action_patch_list;
    r = PolicyAnalyzePatch(policys, component_patch_list, action_patch_list);
    if (!r) {
        delete (talk);
        return false;
    }

    PolicyModelList syms({}, talk);
    rsymbols = syms;

    //----------------- ---------------------------------------------action v2--------------------------------
    // action query
    for (auto it : action_patch_list) {
        get_action_component_recursion(talk , it.first,  rsymbols._all_action_comps);
    }
    ComponentApplyPatchV2(action_patch_list, rsymbols._all_action_comps);

    std::set<uint64_t > pmids;
    ComponentAnalyzePolicyModelV2(rsymbols._all_action_comps, pmids);

    //----------------------end
//----------------------------------------------------------------v1---------------------------------

//    std::vector<Json::Value> action_from_http;
//    for (auto it : action_patch_list) {
//        std::string jstr;
//        r = talk->SearchComponentByID(std::to_string(it.first), jstr);
//        if (!r) break;
//        Json::Value value ;
//        printf("------actions-----%s\n", jstr.c_str());
//        get_action_jsvalue_from_string(jstr, value);
//        action_from_http.push_back(value);
//    }
//    if (action_from_http.size() != action_patch_list.size()) {
//        delete (talk);
//        return false;
//    }
//    ComponentApplyPatch(action_patch_list, action_from_http);

//    std::vector<Json::Value> component_from_http;
//    for (auto it : component_patch_list) {
//        std::string jstr;
//        r = talk->SearchComponentByID(std::to_string(it.first), jstr);
//        if (!r) break;
//        Json::Value value;
//        std::vector<int> subid;
//        get_component_jsvalue_from_string(jstr, value, subid);
//        component_from_http.push_back(value);
//
//    }
//    //
//    if (component_from_http.size() != component_patch_list.size()) {
//        delete (talk);
//        return false;
//    }
//    ComponentApplyPatch(component_patch_list, component_from_http);
//
//    std::set<uint64_t > pmids;
//    ComponentAnalyzePolicyModel(component_from_http, pmids);


    //----------------- ---------------------------------------------v2--------------------------------
    // component query
    std::map<int, Json::Value> contents;
    for (auto it : component_patch_list) {
        get_component_recursion(talk , it.first,  rsymbols._allcomponents);
    }
    ComponentApplyPatchV2(component_patch_list, rsymbols._allcomponents);

    ComponentAnalyzePolicyModelV2(rsymbols._allcomponents, pmids);
    //----------------------end

    for (auto& it : pmids) {
        PolicyModel pm;
        bool r = rsymbols.AddPmByID(it, pm);
        if (!r) break;
    }
    rpolicys = policys;
    //rsymbols = syms;
    return true;
}

bool PolicyHelper::PolicyAnalyzePatch(std::vector<Json::Value>& policy_roots,
                        std::map<CID, std::vector<Json::Value *>> &component_patch_list, std::map<AID, std::vector<Json::Value *>> &action_patch_list) {
    for (auto& it : policy_roots) {
        {
            assert(it.isMember(KEY_ACTION_COMPONENTS));
            auto &action = it[KEY_ACTION_COMPONENTS];
            for (unsigned i = 0; i < action.size(); ++i) {
                auto &action_it = action[i];
                assert(action_it.isMember(KEY_COMPONENTS));
                auto &components = action_it[KEY_COMPONENTS];
                for (unsigned j = 0; j < components.size(); ++j) {
                    auto &component = components[j];
                    assert(component.isMember(KEY_ID));
                    assert(component.isMember(KEY_ACTIONS));
                    action_patch_list[component[KEY_ID].asInt()].push_back(&component);
                }
            }
        }
        {
            assert(it.isMember(KEY_SUBJECT_COMPONENTS));
            auto &subject = it[KEY_SUBJECT_COMPONENTS];
            for (unsigned i = 0; i < subject.size(); ++i) {
                auto &action_it = subject[i];
                assert(action_it.isMember(KEY_COMPONENTS));
                auto &components = action_it[KEY_COMPONENTS];
                for (unsigned j = 0; j < components.size(); ++j) {
                    auto &component = components[j];
                    assert(component.isMember(KEY_ID));
                    assert(component.isMember(KEY_CONDITIONS));
                    component_patch_list[component[KEY_ID].asInt()].push_back(&component);
                }
            }
        }
        {
            assert(it.isMember(KEY_FROM_RESOURCE_COMPONENTS));
            auto &subject = it[KEY_FROM_RESOURCE_COMPONENTS];
            for (unsigned i = 0; i < subject.size(); ++i) {
                auto &action_it = subject[i];
                assert(action_it.isMember(KEY_COMPONENTS));
                auto &components = action_it[KEY_COMPONENTS];
                for (unsigned j = 0; j < components.size(); ++j) {
                    auto &component = components[j];
                    assert(component.isMember(KEY_ID));
                    assert(component.isMember(KEY_CONDITIONS));
                    component_patch_list[component[KEY_ID].asInt()].push_back(&component);
                }
            }
        }
    }
    return true;
}

//bool PolicyHelper::ComponentApplyPatch(const std::map<CID, std::vector<Json::Value *>> &component_patch_list, const std::vector<Json::Value>& from_http) {
//    assert(from_http.size() == component_patch_list.size());
//    for (auto& it : from_http) {
//        assert(it.isMember(KEY_ID));
//        CID cid = it[KEY_ID].asInt();
//        auto fd = component_patch_list.find(cid);
//        assert(fd != component_patch_list.end());
//        for (auto patch : fd->second) {
//            *patch = it;
//        }
//    }
//    return true;
//}
//
//bool PolicyHelper::ComponentAnalyzePolicyModel(const std::vector<Json::Value>& components, std::set<uint64_t >& pmids) {
//    for (auto& component : components) {
//        assert(component.isMember(KEY_POLICY_MODEL_ID));
//        pmids.insert(component[KEY_POLICY_MODEL_ID].asInt());
//    }
//    return true;
//}

bool PolicyHelper::ComponentApplyPatchV2(const std::map<CID, std::vector<Json::Value *>> &component_patch_list, const std::map<int, Json::Value>& from_http) {
    for (auto& it : from_http) {
        assert(it.second.isMember(KEY_ID));
        CID cid = (it.second)[KEY_ID].asInt();
        auto fd = component_patch_list.find(cid);
        if(fd != component_patch_list.end()){
            for (auto patch : fd->second) {
                *patch = it.second;
            }
        }
    }
    return true;
}

bool PolicyHelper::ComponentAnalyzePolicyModelV2(const std::map<int, Json::Value>& components, std::set<uint64_t >& pmids) {
    for (auto& component : components) {
        assert(component.second.isMember(KEY_POLICY_MODEL_ID));
        pmids.insert((component.second)[KEY_POLICY_MODEL_ID].asInt());
    }
    return true;
}

