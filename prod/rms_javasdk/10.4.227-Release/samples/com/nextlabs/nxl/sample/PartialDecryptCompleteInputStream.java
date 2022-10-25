package com.nextlabs.nxl.sample;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import com.nextlabs.common.shared.Constants.TokenGroupType;
import com.nextlabs.nxl.RightsManager;

public class PartialDecryptCompleteInputStream {

    public static void main(String[] args) throws Exception {

        String routerURL = "https://{rms_router}/router";
        String appKey = "";
        int appId = 1;

        String inputFile = "";
        String outputFile = "";

        int start = 510;
        int len = 10;
        
        String tenantName = "";
        String projectName = "";
        //TokenGroupType tgType = null; // define TOKENGROUP_TENANT or TOKENGROUP_SYSTEMBUCKET
        
        RightsManager manager = new RightsManager(routerURL, appId, appKey);
        try (InputStream is = new FileInputStream(inputFile)) {
            try (OutputStream os = new FileOutputStream(outputFile)) {
                manager.decryptPartial(is, os, null, start, len, tenantName, projectName);
                //manager.decryptPartial(is, os, null, start, len, tenantName, tgType);
            }
        }
        System.out.println("Partial Decryption Completed");
    }
}
