package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.PublishArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PublishArticle implements PublishArticleService {
    private final ArticleRepository articleRepository;

    public PublishArticle(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<Article> execute(Long id) {
        Optional<Article> articleOptional = articleRepository.findById(id);
        if (articleOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Article article = articleOptional.get();
        article.setPublished(true);
        article.setPublishedAt(LocalDateTime.now());
        
        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.ok(savedArticle);
    }
}