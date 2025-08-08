package com.example.BlogAPI.Services.newsletterServices;

import com.example.BlogAPI.Models.NewsletterSubscriber;
import com.example.BlogAPI.Repositories.NewsletterRepository;
import org.springframework.stereotype.Service;

@Service
public class NewsletterSubscriptionService {

    private final NewsletterRepository subscriberRepository;

    public NewsletterSubscriptionService(NewsletterRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    public String subscribe(String email) {
        boolean exists = subscriberRepository.existsByEmail(email);
        if (exists) return "Already subscribed";

        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        subscriberRepository.save(subscriber);

        return "Subscribed successfully";
    }
}
