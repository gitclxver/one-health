package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.GetPublishedArticlesService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GetPublishedArticles implements GetPublishedArticlesService {
    private final ArticleRepository articleRepository;

    public GetPublishedArticles(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<List<Article>> getPublished() {
        List<Article> publishedArticles = articleRepository.findByPublishedTrue();
        return ResponseEntity.ok(publishedArticles);
    }

    @Override
    public ResponseEntity<Article> getArticleById(Long id) {
        Optional<Article> article = articleRepository.findByIdAndPublishedTrue(id);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article.get());
    }
}