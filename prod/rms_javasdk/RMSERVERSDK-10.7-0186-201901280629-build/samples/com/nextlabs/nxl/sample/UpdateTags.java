package com.nextlabs.nxl.sample;

import java.util.HashMap;
import java.util.Map;

import com.nextlabs.nxl.RightsManager;

public class UpdateTags {

    public static void main(String[] args) throws Exception {

        String routerURL = "https://{rms_router}/router";
        String appKey = "";
        int appId = 1;

        String inputFile = "";

        RightsManager manager = new RightsManager(routerURL, appId, appKey);
        Map<String, String[]> tags = manager.readTags(inputFile, null);
        
        printTags(tags);
        
        Map<String, String[]> tagMap = new HashMap<>();
        String[] classification = { "EAR" };
        String[] securityClearance = { "Level 0" };
        tagMap.put("Security Clearance", securityClearance);
        tagMap.put("Classification", classification);
        
        manager.updateTags(inputFile, tagMap, null);
        System.out.println("\nTags Updated\n");
        
        tags = manager.readTags(inputFile);
        printTags(tags);
    }
    
    public static void printTags(Map<String, String[]> tags){
        System.out.println("Printing tags ...");
        for (Map.Entry<String, String[]> entry : tags.entrySet()) {
            StringBuilder sb = new StringBuilder(entry.getKey());
            sb.append(": ");
            String prefix = "";
            for(String val: entry.getValue()) {
                sb.append(prefix);
                prefix = ", ";
                sb.append(val);
            }
            System.out.println(sb.toString());
        }
    }
}
