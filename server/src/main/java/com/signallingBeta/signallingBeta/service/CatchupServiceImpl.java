package com.signallingBeta.signallingBeta.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class CatchupServiceImpl implements CatchupService {

    private static int uniqueRoomID = 0;

    private static String lastUniqueIDFilePath = "./src/main/java/com/signallingBeta/signallingBeta/DiskFiles/lastUid.txt";

    private static final Logger logger = LoggerFactory.getLogger(CatchupServiceImpl.class);

    static {
        uniqueRoomID = getLastRoomID();
    }

    private static void initialize() {
        System.out.println("CatchupServiceImpl is initialized.");
    }

    private static int getLastRoomID() {
        try {
            FileReader fileReader = new FileReader(lastUniqueIDFilePath);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            String content = bufferedReader.readLine();
            bufferedReader.close();

            if (content != null) {
                int lastSavedRoomID = Integer.parseInt(content);
                return lastSavedRoomID;
            } else {
                logger.info("File is empty or doesn't exist.");
            }
        } catch (IOException | NumberFormatException e) {
            e.printStackTrace();
        }

        return 0;
    }


    @Override
    public String generateUniqueRoomID() {
        int currNewRoomID = ++uniqueRoomID;
        logger.info("Assigning new Room ID: " + currNewRoomID);
        saveLastRoomID(currNewRoomID);
        return String.valueOf(currNewRoomID);
    }

    private int saveLastRoomID(int currNewRoomID) {

        try {
            FileWriter fileWriter = new FileWriter(lastUniqueIDFilePath);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(String.valueOf(currNewRoomID));
            bufferedWriter.close();
            logger.info("Variable has been written to " + lastUniqueIDFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return 0;
    }
}
