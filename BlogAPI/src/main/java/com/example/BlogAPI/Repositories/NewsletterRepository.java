package com.example.BlogAPI.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.BlogAPI.Models.NewsletterSubscriber;

public interface NewsletterRepository extends JpaRepository<NewsletterSubscriber, Long> {

    Optional<NewsletterSubscriber> findByEmail(String email);
    
}
