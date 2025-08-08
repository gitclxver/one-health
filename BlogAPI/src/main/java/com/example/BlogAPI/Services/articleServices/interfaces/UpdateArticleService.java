package com.example.BlogAPI.Services.articleServices.interfaces;

import org.springframework.http.ResponseEntity;

import com.example.BlogAPI.Models.Article;


public interface UpdateArticleService {
    ResponseEntity<Article> execute(Long id, Article updatedArticle);
    ResponseEntity<Article> setFeaturedStatus(Long id, boolean featured);
}