package com.nextlabs.nxl.sample;

import com.nextlabs.nxl.NxlFile;
import com.nextlabs.nxl.RightsManager;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class PartialDecryptPartialInputStream {

    public static void main(String[] args) throws Exception {

        String routerURL = "https://{rms_router}/router";
        String appKey = "";
        int appId = 1;

        String inputFile = "";
        String outputFile = "";

        int start = 510;
        int len = 10;

        RightsManager manager = new RightsManager(routerURL, appId, appKey);
        
        String tenantName = "";
        String projectName = "";
        //TokenGroupType tgType = null; // define TOKENGROUP_TENANT or TOKENGROUP_SYSTEMBUCKET

        // Build NXL header and store it to reuse it for future partial decryptions 
        byte[] buf = new byte[RightsManager.getHeaderSize()];
        try (InputStream is = new FileInputStream(inputFile)) {
            is.read(buf);
        }
        // Requires tenantName (null will default to default tenant) as SDK adds ability to cache the token in Guava cache for decryptPartial
        NxlFile header = manager.buildNxlHeader(buf, tenantName, projectName);
        //NxlFile header = manager.buildNxlHeader(buf, tenantName, tgType);

        try (InputStream is = new FileInputStream(inputFile)) {
            // Emulating the behavior where a client would pass the input stream without the NXL header and partially stripped content.
            is.skip(RightsManager.getHeaderSize());
            // The input stream provided by the client should start from multiples of RightsManager.getBlockSize(). (e.g. 0 or 1 * BLK_SIZE or 2 * BLK_SIZE)
            is.skip((start / RightsManager.getBlockSize()) * RightsManager.getBlockSize());

            try (OutputStream os = new FileOutputStream(outputFile)) {
                manager.decryptPartial(is, os, header, start, len, tenantName, projectName);
                //manager.decryptPartial(is, os, header, start, len, tenantName, tgType);
            }
        }
        System.out.println("Partial Decryption Completed");
    }
}
