package com.example.BlogAPI.Services.articleServices;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.UpdateArticleService;

@Service
public class UpdateArticle implements UpdateArticleService {
    private final ArticleRepository articleRepository;

    public UpdateArticle(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<Article> execute(Long id, Article updatedArticle) {
        Optional<Article> articleOptional = articleRepository.findById(id);
        if (articleOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Article existingArticle = articleOptional.get();
        existingArticle.setTitle(updatedArticle.getTitle());
        existingArticle.setContent(updatedArticle.getContent());
        existingArticle.setAuthorId(updatedArticle.getAuthorId());
        
        Article savedArticle = articleRepository.save(existingArticle);
        return ResponseEntity.ok(savedArticle);
    }

    @Override
    public ResponseEntity<Article> setFeaturedStatus(Long id, boolean featured) {
        Optional<Article> articleOptional = articleRepository.findById(id);
        if (articleOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Article article = articleOptional.get();
        article.setFeatured(featured);
        
        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.ok(savedArticle);
    }
}