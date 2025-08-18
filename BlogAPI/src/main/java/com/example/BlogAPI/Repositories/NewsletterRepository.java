package com.example.BlogAPI.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.BlogAPI.Models.NewsletterSubscriber;

public interface NewsletterRepository extends JpaRepository<NewsletterSubscriber, Long> {

    Optional<NewsletterSubscriber> findByEmail(String email);
    Optional<NewsletterSubscriber> findByVerificationToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM NewsletterSubscriber s WHERE s.isVerified = false AND s.tokenExpiry < CURRENT_TIMESTAMP")
    void deleteExpiredUnverified();


    @Transactional
    void deleteByEmail(String email);

}
