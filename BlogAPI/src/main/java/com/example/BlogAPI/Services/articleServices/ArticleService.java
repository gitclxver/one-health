package com.example.BlogAPI.Services.articleServices;

import java.util.List;
import java.util.Optional;

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
    Article unpublishArticle(Long articleId);
}