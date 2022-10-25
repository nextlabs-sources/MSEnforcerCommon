//
// Created by jeff on 2019/10/24.
//
#ifndef POLICY_ANALYZE_LIST
#define POLICY_ANALYZE_LIST

#include <json/json.h>




void get_policy_jsvalue_from_string(const std::string & str, Json::Value & out) {

    Json::CharReaderBuilder builder;
    Json::CharReader *pread = builder.newCharReader();
    Json::Value root;
    if (!pread->parse(str.c_str(), str.c_str() + str.length(), &root, nullptr)) {
        delete (pread);
        printf("json string is incorrect");
        return ;
    }
    delete (pread);
    pread = nullptr;


    Json::Value &jsdata = root["data"];
    out["id"] = jsdata["id"];
    out["name"] = jsdata["name"];
    out["effectType"] = jsdata["effectType"];
    {///actionComponents
        Json::Value &jsactioncomp = jsdata["actionComponents"];
        Json::Value jsactioncomps_w;
        for (auto it = jsactioncomp.begin();it != jsactioncomp.end(); ++it) {
            assert((*it).isMember("operator"));
            Json::Value jscomps_w;
            jscomps_w["operator"] = (*it)["operator"];

            assert((*it).isMember("components"));
            Json::Value &jscomps = (*it)["components"];
            Json::Value jscomps_arr;
            for (auto itc = jscomps.begin(); itc != jscomps.end(); ++itc) {
                Json::Value jsaction_w;
                assert((*itc)["id"]);
                jsaction_w["id"] = (*itc)["id"];
                jsaction_w["actions"] =  Json::Value("");
                jscomps_arr.append(jsaction_w);
            }
            jscomps_w["components"] = jscomps_arr;
            jsactioncomps_w.append(jscomps_w);
        }
        out["actionComponents"] = jsactioncomps_w;
    }

    {///subjectComponents
        Json::Value &jssubcomps = jsdata["subjectComponents"];
        Json::Value jssubcomps_arr;
        for (auto it = jssubcomps.begin();it != jssubcomps.end(); ++it) {
            assert((*it).isMember("operator"));
            Json::Value jscomps_w;
            jscomps_w["operator"] = (*it)["operator"];

            assert((*it).isMember("components"));
            Json::Value &jscomps = (*it)["components"];
            Json::Value jscomps_arr;
            for (auto itc = jscomps.begin(); itc != jscomps.end(); ++itc) {
                Json::Value jsconditions_w;
                assert((*itc)["id"]);
                jsconditions_w["id"] = (*itc)["id"];
                jsconditions_w["conditions"] = Json::Value("");
                jscomps_arr.append(jsconditions_w);
            }
            jscomps_w["components"] = jscomps_arr;
            jssubcomps_arr.append(jscomps_w);
        }
        out["subjectComponents"] = jssubcomps_arr;
    }

    {///fromResourceComponents
        Json::Value &jsrescomps = jsdata["fromResourceComponents"];
        Json::Value jsrescomps_arr;
        for (auto it = jsrescomps.begin();it != jsrescomps.end(); ++it) {
            assert((*it).isMember("operator"));
            Json::Value jscomps_w;
            jscomps_w["operator"] = (*it)["operator"];

            assert((*it).isMember("components"));
            Json::Value &jscomps = (*it)["components"];
            Json::Value jscomps_arr;
            for (auto itc = jscomps.begin(); itc != jscomps.end(); ++itc) {
                Json::Value jsconditions_w;
                assert((*itc)["id"]);
                jsconditions_w["id"] = (*itc)["id"];
                jsconditions_w["conditions"] = Json::Value("");
                jscomps_arr.append(jsconditions_w);
            }
            jscomps_w["components"] = jscomps_arr;
            jsrescomps_arr.append(jscomps_w);
        }
        out["fromResourceComponents"] = jsrescomps_arr;
    }

    ///denyObligations
    out["denyObligations"] = jsdata["denyObligations"];
    ///allowObligations
    out["allowObligations"] = jsdata["allowObligations"];
    ///expression
    out["expression"] = jsdata["expression"];

    {
        Json::StreamWriterBuilder builder;
        const std::string json_file = Json::writeString(builder, out);
    }

    return ;
}

void get_component_jsvalue_from_string(const std::string & str, Json::Value & out, std::vector<int> & subid, bool is_action = false) {
//#define JEFF_TEST
//#ifdef JEFF_TEST
//    if(is_action){
//        printf("------action----%s\n", str.c_str());
//    } else {
//        printf("------sub/res----%s\n", str.c_str());
//    }
//#endif
    Json::CharReaderBuilder builder;
    Json::CharReader *pread = builder.newCharReader();
    Json::Value root;
    if (!pread->parse(str.c_str(), str.c_str() + str.length(), &root, nullptr)) {
        delete (pread);
        printf("json string is incorrect");
        return ;
    }
    delete (pread);
    pread = nullptr;

    const Json::Value &jsdata = root["data"];
    out["id"] = jsdata["id"];
    out["policy_model_id"] = jsdata["policyModel"]["id"].asInt();
    if(is_action) {
        out["actions"] = jsdata["actions"];
    } else {
        out["conditions"] = jsdata["conditions"];
    }


    //get members = sub components
    const Json::Value &jsattr = jsdata["memberConditions"];
    assert(jsattr.isArray());
    Json::Value arr_w;
    for (auto it = jsattr.begin(); it != jsattr.end(); ++it) {
        const Json::Value &jsmembers =(*it)["members"];
        if(jsmembers.isNull()) break;

        assert(jsmembers.isArray());
        Json::Value arrin;
        for (auto it2 = jsmembers.begin(); it2 != jsmembers.end(); ++it2) {
            Json::Value m;
            Json::Value::Int id =(*it2)["id"].asInt();
            subid.push_back(id);
            m["id"] = id;
            arrin.append(m);
        }
        if(arrin.isArray()){
            Json::Value m;
            m["operator"] = (*it)["operator"];
            m["members"] = arrin;
            arr_w.append(m);
        }
    }
    if(arr_w.isArray()){
        out["memberConditions"] = arr_w;
    }

    return ;
}


#endif