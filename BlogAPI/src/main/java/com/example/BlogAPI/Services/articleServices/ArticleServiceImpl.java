package com.example.BlogAPI.Services.articleServices;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.newsletterServices.NewsletterService;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final NewsletterService newsletterService;

    public ArticleServiceImpl(ArticleRepository articleRepository, NewsletterService newsletterService) {
        this.articleRepository = articleRepository;
        this.newsletterService = newsletterService;
    }

    @Override
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    @Override
    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    @Override
    public List<Article> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue();
    }

    @Override
    public List<Article> getFeaturedArticles() {
        return articleRepository.findByIsFeaturedTrueAndIsPublishedTrue();
    }

    @Override
    public Article createArticle(Article article) {
        Article savedArticle = articleRepository.save(article);
        
        // Send newsletter if article is published
        if (savedArticle.isPublished() && !savedArticle.isNewsletterSent()) {
            newsletterService.sendNewsletter(savedArticle.getId());
            savedArticle.setNewsletterSent(true);
            return articleRepository.save(savedArticle);
        }

        return savedArticle;
    }

    @Override
    public Article updateArticle(Long id, Article updatedArticle) {
        return articleRepository.findById(id).map(existing -> {
            existing.setTitle(updatedArticle.getTitle());
            existing.setDescription(updatedArticle.getDescription());
            existing.setContent(updatedArticle.getContent());
            
            // Only update image URL if provided
            if (updatedArticle.getImageUrl() != null && !updatedArticle.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(updatedArticle.getImageUrl());
            }
            
            existing.setFeatured(updatedArticle.isFeatured());
            return articleRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
    }

    @Override
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article not found with id: " + id);
        }
        articleRepository.deleteById(id);
    }

    @Override
    public Article updateImageUrl(Long articleId, String imageUrl) {
        return articleRepository.findById(articleId).map(article -> {
            article.setImageUrl(imageUrl);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));
    }

    @Override
    public Article publishArticle(Long articleId) {
        return articleRepository.findById(articleId).map(article -> {
            article.setPublished(true);
            article.setPublishedAt(LocalDateTime.now());

            // Send newsletter if not already sent
            if (!article.isNewsletterSent()) {
                newsletterService.sendNewsletter(articleId);
                article.setNewsletterSent(true);
            }

            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));
    }

    @Override
    public Article unpublishArticle(Long articleId) {
        return articleRepository.findById(articleId).map(article -> {
            article.setPublished(false);
            article.setPublishedAt(null);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));
    }
}