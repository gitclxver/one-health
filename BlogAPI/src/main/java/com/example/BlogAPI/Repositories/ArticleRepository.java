package com.example.BlogAPI.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.BlogAPI.Models.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByIsPublishedTrue();

    List<Article> findByIsFeaturedTrueAndIsPublishedTrue();
    
}
