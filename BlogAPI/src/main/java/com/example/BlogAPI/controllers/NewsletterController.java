package com.example.BlogAPI.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Services.newsletterServices.NewsletterRetrievalService;
import com.example.BlogAPI.Services.newsletterServices.NewsletterSendService;
import com.example.BlogAPI.Services.newsletterServices.NewsletterSubscriptionService;

@RestController
@RequestMapping("/api/v1/newsletter")
public class NewsletterController {

    private final NewsletterSubscriptionService subscriptionService;
    private final NewsletterRetrievalService retrievalService;
    private final NewsletterSendService sendService;

    public NewsletterController(
            NewsletterSubscriptionService subscriptionService,
            NewsletterRetrievalService retrievalService,
            NewsletterSendService sendService) {
        this.subscriptionService = subscriptionService;
        this.retrievalService = retrievalService;
        this.sendService = sendService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody String email) {
        return ResponseEntity.ok(subscriptionService.subscribe(email));
    }

    @GetMapping("/admin/subscribers")
    public ResponseEntity<List<String>> getSubscribers() {
        return ResponseEntity.ok(retrievalService.getAllSubscriberEmails());
    }

    @PostMapping("/admin/send/{articleId}")
    public ResponseEntity<String> sendNewsletter(@PathVariable Long articleId) {
        return ResponseEntity.ok(sendService.sendNewsletter(articleId));
    }
}
