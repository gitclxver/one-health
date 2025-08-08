package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.articleServices.interfaces.DeleteArticleByIdService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeleteArticleById implements DeleteArticleByIdService {
    private final ArticleRepository articleRepository;

    public DeleteArticleById(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Override
    public ResponseEntity<String> execute(Long id) {
        Optional<Article> article = articleRepository.findById(id);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        articleRepository.deleteById(id);
        return ResponseEntity.ok("Article deleted successfully");
    }
}