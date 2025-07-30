package com.example.BlogAPI.Repositories;

import com.example.BlogAPI.Models.article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface articleRepository extends JpaRepository<article,Long> {
}
