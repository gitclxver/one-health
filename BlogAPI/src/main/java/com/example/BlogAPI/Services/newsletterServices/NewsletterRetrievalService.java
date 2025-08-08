package com.example.BlogAPI.Services.newsletterServices;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BlogAPI.Repositories.NewsletterRepository;

@Service
public class NewsletterRetrievalService {

    private final NewsletterRepository subscriberRepository;

    public NewsletterRetrievalService(NewsletterRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    public List<String> getAllSubscriberEmails() {
        return subscriberRepository.findAll()
                                   .stream()
                                   .map(sub -> sub.getEmail())
                                   .toList();
    }
}
