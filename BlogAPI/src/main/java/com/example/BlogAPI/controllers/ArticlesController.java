package com.example.BlogAPI.controllers;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Services.articleServices.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/articles")
public class ArticlesController {
    private final AddNewArticle addNewArticle;
    private final DeleteArticleById deleteArticleById;
    private final GetAllArticles getAllArticles;
    private final PublishArticle publishArticle;
    private final GetPublishedArticles getPublishedArticles;
    private final GetFeaturedArticles getFeaturedArticles;
    private final UpdateArticle updateArticle;
    private final ArticleImageService articleImageService;

    public ArticlesController(AddNewArticle addNewArticle,
                            DeleteArticleById deleteArticleById,
                            GetAllArticles getAllArticles,
                            PublishArticle publishArticle,
                            GetPublishedArticles getPublishedArticles,
                            GetFeaturedArticles getFeaturedArticles,
                            UpdateArticle updateArticle,
                            ArticleImageService articleImageService) {
        this.addNewArticle = addNewArticle;
        this.deleteArticleById = deleteArticleById;
        this.getAllArticles = getAllArticles;
        this.publishArticle = publishArticle;
        this.getPublishedArticles = getPublishedArticles;
        this.getFeaturedArticles = getFeaturedArticles;
        this.updateArticle = updateArticle;
        this.articleImageService = articleImageService;
    }

    // Public endpoints
    @GetMapping("/published")
    public ResponseEntity<List<Article>> getPublishedArticles() {
        return getPublishedArticles.getPublished();
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Article>> getFeaturedArticles() {
        return getFeaturedArticles.getFeatured();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return getPublishedArticles.getArticleById(id);
    }

    // Admin endpoints
    @GetMapping("/admin")
    public ResponseEntity<List<Article>> getAllArticles() {
        return getAllArticles.execute();
    }

    @PostMapping("/admin")
    public ResponseEntity<Article> addNewArticle(@Valid @RequestBody Article newArticle) {
        return addNewArticle.execute(newArticle);
    }

    @PostMapping("/admin/upload-image/{articleId}")
    public ResponseEntity<String> uploadImage(
            @PathVariable Long articleId,
            @RequestParam("file") MultipartFile file) {
        String imageUrl = articleImageService.uploadImage(articleId, file);
        return ResponseEntity.ok(imageUrl);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Article> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody Article updatedArticle) {
        return updateArticle.execute(id, updatedArticle);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        return deleteArticleById.execute(id);
    }


    @PostMapping("/admin/{id}/publish")
    public ResponseEntity<Article> publishArticle(@PathVariable Long id) {
        return publishArticle.execute(id);
    }

    @PostMapping("/admin/{id}/feature")
    public ResponseEntity<Article> featureArticle(
            @PathVariable Long id,
            @RequestParam boolean featured) {
        return updateArticle.setFeaturedStatus(id, featured);
    }
}