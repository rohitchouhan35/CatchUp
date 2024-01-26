package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.model.SimpleMessage;
import com.signallingBeta.signallingBeta.repository.SimpleMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class ChatMessageQueueService {

    private static final Logger logger = LoggerFactory.getLogger(ChatMessageQueueService.class);

    @Autowired
    private SimpleMessageRepository simpleMessageRepository;
    private final BlockingQueue<SimpleMessage> messageQueue = new LinkedBlockingQueue<>();
    public static int maxChatQueueBufferSize = 10;

    public void enqueueMessage(SimpleMessage simpleMessage) {
        logger.info("Enqueueing message: " + simpleMessage.toString());
        try {
            messageQueue.put(simpleMessage);
            logger.info("ChatMessage Queue size is: " + messageQueue.size());

            // triggering insert when queue size is 5
            if(messageQueue.size() >= maxChatQueueBufferSize) {
                startNewThreadToSaveChatMessage();
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            // do something on interruption
        }
    }

    private void startNewThreadToSaveChatMessage() {
        try {
            List<Thread> threads = new ArrayList<>();
            Thread savingToDatabaseThread = new Thread(() -> {
//                saveChatMessage(messageQueue);
                saveBatchChatMessages(messageQueue);
            });

            threads.add(savingToDatabaseThread);

            for (Thread thread : threads) {
                thread.start();
            }

            for (Thread thread : threads) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    private void saveChatMessage(BlockingQueue<SimpleMessage> messageQueue) {
        logger.info("Saving " + messageQueue.size() + " messages....");
        try {
            while(messageQueue.size() > 0) {
                SimpleMessage simpleMessage = dequeueMessage();
                logger.info("Saving message to database.... " + simpleMessage.toString());
                saveMessageAsync(simpleMessage);
            }
            logger.info("Saved Successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    private void saveMessageAsync(SimpleMessage simpleMessage) {
        try {
            simpleMessageRepository.save(simpleMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    private void saveBatchChatMessages(BlockingQueue<SimpleMessage> messageQueue) {
        List<SimpleMessage> messagesToSave = new ArrayList<>();
        messageQueue.drainTo(messagesToSave, maxChatQueueBufferSize);

        if (!messagesToSave.isEmpty()) {
            logger.info("Saving batch of messages to database....");

            saveBatchMessagesAsync(messagesToSave);
        }
    }

    @Async
    private void saveBatchMessagesAsync(List<SimpleMessage> messages) {
        try {
            simpleMessageRepository.saveAll(messages);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public SimpleMessage dequeueMessage() {
        try {
            return messageQueue.take();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            // Handle the interruption if needed
            return null;
        }
    }

}
