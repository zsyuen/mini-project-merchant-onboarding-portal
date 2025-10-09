package com.merchant.portal.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;

public class ApplicationIdGenerator {

    private static final AtomicInteger counter = new AtomicInteger(0);
    private static String lastDate = "";

    public static synchronized String generateId() {
        String today = new SimpleDateFormat("yyyyMMdd").format(new Date());

        // Reset counter daily
        if (!today.equals(lastDate)) {
            lastDate = today;
            counter.set(0);
        }

        // Format of reference id: yyyyMMddHHmmss-001
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int sequence = counter.incrementAndGet();
        return String.format("%s-%03d", timestamp, sequence);
    }
}
