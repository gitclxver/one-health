package com.example.BlogAPI.Security;


import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SendEmail {
    private final JavaMailSender mailSender;

    public SendEmail(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public void sendEmail(String to,String Subject,String body){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom("alexandraside@gmail.com");
        message.setSubject(Subject);
        message.setText(body);

        mailSender.send(message);
    }
}

