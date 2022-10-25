package com.nextlabs.nxl.sample;

import com.nextlabs.nxl.RightsManager;

public class Decrypt {

    public static void main(String[] args) throws Exception {

        String routerURL = "https://{rms_router}/router";
        String appKey = "";
        int appId = 1;

        String inputFile = "";
        String outputFile = "";

        RightsManager manager = new RightsManager(routerURL, appId, appKey);
        manager.decrypt(inputFile, outputFile, null);
        System.out.println("Decryption Completed");
    }
}
