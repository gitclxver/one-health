package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Models.article;
import com.example.BlogAPI.Repositories.Command;
import com.example.BlogAPI.Repositories.articleRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AddnewArticle implements Command<article, article> {
    private final articleRepository articleRepo;

    public AddnewArticle(articleRepository articleRepo) {
        this.articleRepo = articleRepo;
    }
    @Transactional
    @Override
    public ResponseEntity<article> execute(article input) {
        article newarticle = articleRepo.save(input);
        return ResponseEntity.ok().body(newarticle);
    }
}
