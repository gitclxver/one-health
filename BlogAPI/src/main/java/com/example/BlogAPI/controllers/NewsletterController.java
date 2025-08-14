package com.example.BlogAPI.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.NewsletterSubscriber;
import com.example.BlogAPI.Services.newsletterServices.NewsletterService;

@RestController
@RequestMapping("/newsletter/admin")
public class NewsletterController {

    private final NewsletterService newsletterService;

    @Autowired
    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @GetMapping("/subscribers")
    public List<NewsletterSubscriber> getSubscribers() {
        return newsletterService.getAllSubscribers();
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
