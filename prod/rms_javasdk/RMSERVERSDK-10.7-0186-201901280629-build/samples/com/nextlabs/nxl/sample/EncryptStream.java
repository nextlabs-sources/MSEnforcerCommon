package com.nextlabs.nxl.sample;

import com.nextlabs.nxl.Rights;
import com.nextlabs.nxl.RightsManager;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public class EncryptStream {

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
        try(InputStream is = new FileInputStream(inputFile)) {
            try(OutputStream os = new FileOutputStream(outputFile)) {
                File in = new File(inputFile);
                String fileName = in.getName();
                long length = in.length();
                manager.encryptStream(is, os, fileName, length, null, rights, tagMap, null);
                System.out.println("Stream Encryption Completed");
            }
        }
    }
}
