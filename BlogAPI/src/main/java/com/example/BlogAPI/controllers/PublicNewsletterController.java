package com.example.BlogAPI.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.NewsletterSubscriber;
import com.example.BlogAPI.Services.newsletterServices.NewsletterService;


@RestController
@RequestMapping("/api/v1/newsletter")
public class PublicNewsletterController {

    private final NewsletterService newsletterService;

    @Autowired
    public PublicNewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> addSubscriber(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        try {
            NewsletterSubscriber saved = newsletterService.addSubscriber(email);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestParam("email") String email) {
        var optional = newsletterService.getAllSubscribers()
            .stream()
            .filter(sub -> sub.getEmail().equalsIgnoreCase(email))
            .findFirst();

        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Subscriber not found");
        }

        NewsletterSubscriber subscriber = optional.get();
        subscriber.setActive(false);
        return ResponseEntity.ok(newsletterService.toggleSubscriberStatus(subscriber.getId()));
    }
}
