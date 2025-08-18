package com.example.BlogAPI.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.NewsletterSubscriber;
import com.example.BlogAPI.Services.newsletterServices.NewsletterService;

@RestController
@RequestMapping("/api/v1/newsletter/admin")
public class NewsletterController {

    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @GetMapping("/subscribers")
    public List<NewsletterSubscriber> getSubscribers() {
        return newsletterService.getAllSubscribers();
    }


    @PatchMapping("/subscribers/{id}/toggle")
    public ResponseEntity<?> toggleSubscriberStatus(@PathVariable Long id) {
        try {
            NewsletterSubscriber updated = newsletterService.toggleSubscriberStatus(id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/send/{articleId}")
    public ResponseEntity<?> sendNewsletter(@PathVariable Long articleId) {
        newsletterService.sendNewsletter(articleId);
        return ResponseEntity.ok(Map.of("message", "Newsletter sent"));
    }
}
