package com.example.BlogAPI.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
import org.springframework.web.multipart.MultipartFile;

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

    @PutMapping("/admin/{id}/publish")
    public ResponseEntity<Article> togglePublishStatus(
        @PathVariable Long id,
        @RequestParam boolean publish) {
        
        Article updatedArticle = publish ? 
            articleService.publishArticle(id) :
            articleService.unpublishArticle(id);
        
        return ResponseEntity.ok(updatedArticle);
    }

    @PostMapping("/admin/{id}/feature")
    public ResponseEntity<Article> toggleFeatureArticle(
            @PathVariable Long id,
            @RequestParam boolean featured) {
        return ResponseEntity.ok(articleService.toggleFeature(id, featured));
    }

    // ===== Image Handling =====

    @PostMapping("/admin/upload-temp")
    public ResponseEntity<String> uploadTempImage(@RequestParam("image") MultipartFile file) {
        try {
            String filename = articleService.saveTempImage(file);
            return ResponseEntity.ok("/uploads/articles/" + filename);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/admin/finalize-image/{articleId}")
    public ResponseEntity<String> finalizeTempImage(
            @PathVariable Long articleId,
            @RequestBody Map<String, String> request) {
        try {
            String tempPath = request.get("tempPath");
            if (tempPath == null || tempPath.isEmpty()) {
                return ResponseEntity.badRequest().body("tempPath is required");
            }
            String finalImageUrl = articleService.finalizeTempImage(tempPath, articleId);
            return ResponseEntity.ok(finalImageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to finalize image: " + e.getMessage());
        }
    }

    @PostMapping("/admin/upload-image/{articleId}")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long articleId,
            @RequestParam("image") MultipartFile file) { 
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String uploadDir = "uploads/articles/";

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File destination = new File(uploadDir + filename);
            file.transferTo(destination);

            Article article = articleService.updateImageUrl(articleId, "/uploads/articles/" + filename);
            return ResponseEntity.ok().body(Map.of("imageUrl", article.getImageUrl()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed");
        }
    }

}
