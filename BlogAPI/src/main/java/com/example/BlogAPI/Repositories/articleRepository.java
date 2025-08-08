package com.example.BlogAPI.Repositories;

import com.example.BlogAPI.Models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
    // Find all published articles
    List<Article> findByPublishedTrue();
    
    // Find all featured AND published articles
    List<Article> findByFeaturedTrueAndPublishedTrue();
    
    // Find a specific published article by ID
    Optional<Article> findByIdAndPublishedTrue(Long id);
    
    // Custom query example (if you need more complex queries)
    // @Query("SELECT a FROM Article a WHERE a.title LIKE %:keyword% AND a.published = true")
    // List<Article> searchPublishedArticles(@Param("keyword") String keyword);
}