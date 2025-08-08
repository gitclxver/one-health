package com.example.BlogAPI.Utilities;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendEmail(String to, String subject, String content) {
        // Placeholder logic – use JavaMailSender or SMTP config here
        System.out.println("Sending email to " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Content: " + content);
    }
}
