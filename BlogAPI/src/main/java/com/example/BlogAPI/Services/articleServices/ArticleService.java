package com.example.BlogAPI.Services.articleServices;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Article;

public interface ArticleService {

    List<Article> getAllArticles();

    Optional<Article> getArticleById(Long id);

    List<Article> getPublishedArticles();

    List<Article> getFeaturedArticles();

    Article createArticle(Article article);

    Article updateArticle(Long id, Article updatedArticle);

    void deleteArticle(Long id);

    Article updateImageUrl(Long articleId, String imageUrl);

    Article publishArticle(Long articleId);

    Article toggleFeature(Long articleId, boolean isFeatured);

    String saveTempImage(MultipartFile file) throws IOException;

    String finalizeTempImage(String tempPath, Long articleId) throws IOException;

    void cleanupTempFiles();

    Article togglePublishStatus(Long articleId);

    Article unpublishArticle(Long articleId);

    Article setFeatured(Long articleId, boolean isFeatured);

    Article uploadArticleImage(Long articleId, MultipartFile image) throws IOException;
    
}
