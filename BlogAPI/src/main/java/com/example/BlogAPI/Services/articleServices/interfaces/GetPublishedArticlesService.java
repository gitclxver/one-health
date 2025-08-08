package com.example.BlogAPI.Services.articleServices.interfaces;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.BlogAPI.Models.Article;


public interface GetPublishedArticlesService {
    ResponseEntity<List<Article>> getPublished();
    ResponseEntity<Article> getArticleById(Long id);
}