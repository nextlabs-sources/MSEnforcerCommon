package com.nextlabs.nxl.sample;

import com.nextlabs.nxl.Rights;
import com.nextlabs.nxl.RightsManager;

import java.util.HashMap;
import java.util.Map;

public class Encrypt {

    public static void main(String[] args) throws Exception {

        String routerURL = "https://{rms_router}/router";
        String appKey = "";
        int appId = 1;

        String inputFile = "";
        String outputFile = "";

        Rights[] rights = Rights.fromStrings(new String[] { "DOWNLOAD", "VIEW", "WATERMARK" });

        Map<String, String[]> tagMap = new HashMap<>();
        String[] classification = { "ITAR", "EAR" };
        String[] securityClearance = { "Level 7" };
        tagMap.put("Security Clearance", securityClearance);
        tagMap.put("Classification", classification);
        
        RightsManager manager = new RightsManager(routerURL, appId, appKey);
        manager.encrypt(inputFile, outputFile, null, rights, tagMap, null);
        
        System.out.println("Encryption Completed");
    }
}
