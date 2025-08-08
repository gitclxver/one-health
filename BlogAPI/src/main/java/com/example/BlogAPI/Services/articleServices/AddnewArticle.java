package com.example.BlogAPI.Services.articleServices;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.AddNewArticleService;

@Service
public class AddNewArticle implements AddNewArticleService {
    private final ArticleRepository articleRepository;

    public AddNewArticle(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<Article> execute(Article newArticle) {
        Article savedArticle = articleRepository.save(newArticle);
        return ResponseEntity.ok(savedArticle);
    }
}