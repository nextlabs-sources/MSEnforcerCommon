package com.nextlabs.nxl.sample;

import com.nextlabs.nxl.RightsManager;

public class Decrypt {

    public static void main(String[] args) throws Exception {

        String routerURL = "https://{rms_router}/router";
        String appKey = "";
        int appId = 1;

        String inputFile = "";
        String outputFile = "";
        
        String tenantName = "";
        String projectName = "";
        //TokenGroupType tgType = null; // define TOKENGROUP_TENANT or TOKENGROUP_SYSTEMBUCKET

        RightsManager manager = new RightsManager(routerURL, appId, appKey);
        manager.decrypt(inputFile, outputFile, tenantName, projectName);
        //manager.decrypt(inputFile, outputFile, tenantName, tgType);
        System.out.println("Decryption Completed");
    }
}
