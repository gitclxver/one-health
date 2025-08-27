package com.example.BlogAPI.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Services.articleServices.ArticleService;

@RestController
@RequestMapping("/api/v1/articles")
public class ArticleController {

    private final ArticleService articleService;
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("/published")
    public ResponseEntity<List<Article>> getPublishedArticles() {
        return ResponseEntity.ok(articleService.getPublishedArticles());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Article>> getFeaturedArticles() {
        return ResponseEntity.ok(articleService.getFeaturedArticles());
    }

    // ===== Admin Endpoints =====

    @GetMapping("/admin")
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @PostMapping("/admin")
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        return ResponseEntity.ok(articleService.createArticle(article));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        return ResponseEntity.ok(articleService.updateArticle(id, article));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok("Article deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable String id) {
        try {
            Long articleId = Long.parseLong(id);
            Optional<Article> articleOpt = articleService.getArticleById(articleId);
            return articleOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (NumberFormatException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/admin/publish/{id}")
    public ResponseEntity<Article> publishArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.publishArticle(id));
    }

    @PutMapping("/admin/{id}/unpublish")
    public ResponseEntity<Article> unpublishArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.unpublishArticle(id));
    }

    @PutMapping("/admin/{id}/publish")
    public ResponseEntity<Article> togglePublishStatus(
        @PathVariable Long id,
        @RequestParam boolean publish) {
        
        Article updatedArticle = publish ? 
            articleService.publishArticle(id) :
            articleService.unpublishArticle(id);
        
        return ResponseEntity.ok(updatedArticle);
    }

    // ===== Image Handling =====

    @PutMapping("/admin/{id}/image")
    public ResponseEntity<Article> updateArticleImage(
            @PathVariable Long id, 
            @RequestBody Map<String, String> request) {
        try {
            String imageUrl = request.get("imageUrl");
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Article updatedArticle = articleService.updateImageUrl(id, imageUrl);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}