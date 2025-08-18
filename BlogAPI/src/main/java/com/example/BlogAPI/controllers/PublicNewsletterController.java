package com.example.BlogAPI.controllers;

import java.time.LocalDateTime;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
    private final Logger log = LoggerFactory.getLogger(PublicNewsletterController.class);

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

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestParam("email") String email) {
        try {
            newsletterService.unsubscribe(email);
            return ResponseEntity.ok("You have been unsubscribed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to unsubscribe: " + e.getMessage());
        }
    }


    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyTokenFromQuery(@RequestParam("token") String token) {
        try {
            Map<String, Object> result = newsletterService.verifySubscriberToken(token);
            HttpStatus status = "success".equals(result.get("status")) 
                ? HttpStatus.OK 
                : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(result);
        } catch (Exception e) {
            log.error("Error verifying token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", "error",
                "message", "Internal server error",
                "error", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        log.info("🔍 Received POST verification request for token: {}", token);
        
        if (token == null || token.isBlank()) {
            log.warn("⚠️ Empty token received in POST request");
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Missing token",
                "status", "error"
            ));
        }

        try {
            Map<String, Object> result = newsletterService.verifySubscriberToken(token);
            HttpStatus status = "success".equals(result.get("status")) 
                ? HttpStatus.OK 
                : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(result);
        } catch (Exception e) {
            log.error("Error verifying token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", "error",
                "message", "Internal server error",
                "error", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
            ));
        }
    }
}
