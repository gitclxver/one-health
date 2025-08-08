package com.example.BlogAPI.Services.articleServices.interfaces;

import org.springframework.http.ResponseEntity;

public interface DeleteArticleByIdService {
    ResponseEntity<String> execute(Long id);
}