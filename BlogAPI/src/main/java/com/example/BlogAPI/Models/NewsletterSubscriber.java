package com.example.BlogAPI.Models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "newsletter_subscribers", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private LocalDateTime subscribedAt;

    @Column(nullable = false)
    private boolean isActive = true;

    public NewsletterSubscriber() {}

    public NewsletterSubscriber(String email) {
        this.email = email;
        this.subscribedAt = LocalDateTime.now();
        this.isActive = true;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getSubscribedAt() {
        return subscribedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSubscribedAt(LocalDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
