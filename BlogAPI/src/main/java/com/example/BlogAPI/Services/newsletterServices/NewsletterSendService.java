package com.example.BlogAPI.Services.newsletterServices;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Utilities.EmailService;

@Service
public class NewsletterSendService {

    private final NewsletterRetrievalService retrievalService;
    private final EmailService emailService;
    private final ArticleRepository articleRepository;

    public NewsletterSendService(NewsletterRetrievalService retrievalService,
                                  EmailService emailService,
                                  ArticleRepository articleRepository) {
        this.retrievalService = retrievalService;
        this.emailService = emailService;
        this.articleRepository = articleRepository;
    }

    public String sendNewsletter(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        List<String> recipients = retrievalService.getAllSubscriberEmails();

        for (String email : recipients) {
            emailService.sendEmail(
                email,
                "New Article Published: " + article.getTitle(),
                article.getDescription()
            );
        }

        return "Newsletter sent successfully";
    }
}
