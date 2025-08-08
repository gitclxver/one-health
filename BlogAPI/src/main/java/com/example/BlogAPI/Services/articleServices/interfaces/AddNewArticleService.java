package com.example.BlogAPI.Services.articleServices.interfaces;

import org.springframework.http.ResponseEntity;

import com.example.BlogAPI.Models.Article;

public interface AddNewArticleService {
    ResponseEntity<Article> execute(Article newArticle);
}