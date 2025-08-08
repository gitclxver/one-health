package com.example.BlogAPI.Services.articleServices.interfaces;

import org.springframework.http.ResponseEntity;

import com.example.BlogAPI.Models.Article;

public interface PublishArticleService {
    ResponseEntity<Article> execute(Long id);
}