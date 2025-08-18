package com.example.BlogAPI.Services.newsletterServices;

import java.util.List;
import java.util.Map;

import com.example.BlogAPI.Models.NewsletterSubscriber;

public interface NewsletterService {

    NewsletterSubscriber addSubscriber(String email) throws IllegalArgumentException;

    List<NewsletterSubscriber> getAllSubscribers();

    NewsletterSubscriber toggleSubscriberStatus(Long id);

    void sendNewsletter(Long articleId);

    void unsubscribe(String email);
    
    void removeExpiredUnverifiedSubscribers();

    Map<String, Object> verifySubscriberToken(String token);
    
}
