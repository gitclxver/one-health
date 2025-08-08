package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.GetFeaturedArticlesService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetFeaturedArticles implements GetFeaturedArticlesService {
    private final ArticleRepository articleRepository;

    public GetFeaturedArticles(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<List<Article>> getFeatured() {
        List<Article> featuredArticles = articleRepository.findByFeaturedTrueAndPublishedTrue();
        return ResponseEntity.ok(featuredArticles);
    }
}