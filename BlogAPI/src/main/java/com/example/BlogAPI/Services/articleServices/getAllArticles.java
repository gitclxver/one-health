package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.GetAllArticlesService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllArticles implements GetAllArticlesService {
    private final ArticleRepository articleRepository;

    public GetAllArticles(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<List<Article>> execute() {
        List<Article> articles = articleRepository.findAll();
        return ResponseEntity.ok(articles);
    }
}