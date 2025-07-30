package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Exceptions.noArticleFoundException;
import com.example.BlogAPI.Models.article;
import com.example.BlogAPI.Repositories.articleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class getAllArticles {
    private final articleRepository articleRepo;

    public getAllArticles(articleRepository articleRepo) {
        this.articleRepo = articleRepo;
    }

    public ResponseEntity<List<article>> getAllarticles(){
        List<article> allArticles = articleRepo.findAll();
        if(!(allArticles.isEmpty())){
            return ResponseEntity.ok().body(allArticles);
        }
        throw new noArticleFoundException();
    }
}
