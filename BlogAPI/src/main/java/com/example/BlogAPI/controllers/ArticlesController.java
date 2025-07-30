package com.example.BlogAPI.controllers;

import com.example.BlogAPI.Models.article;
import com.example.BlogAPI.Services.articleServices.AddnewArticle;
import com.example.BlogAPI.Services.articleServices.deleteAllArticles;
import com.example.BlogAPI.Services.articleServices.deleteArticleById;
import com.example.BlogAPI.Services.articleServices.getAllArticles;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(name = "/api/v1/articles")
public class ArticlesController {
    private final AddnewArticle addnewArticle;
    private final deleteAllArticles deleteAllArticles;
    private final deleteArticleById deleteArticleById;
    private final getAllArticles getAllArticles;

    public ArticlesController(AddnewArticle addnewArticle, com.example.BlogAPI.Services.articleServices.deleteAllArticles deleteAllArticles, com.example.BlogAPI.Services.articleServices.deleteArticleById deleteArticleById, com.example.BlogAPI.Services.articleServices.getAllArticles getAllArticles) {
        this.addnewArticle = addnewArticle;
        this.deleteAllArticles = deleteAllArticles;
        this.deleteArticleById = deleteArticleById;
        this.getAllArticles = getAllArticles;
    }

    @GetMapping("/getAllArticles")
    public ResponseEntity<List<article>> getAllArticles(){
        return getAllArticles.getAllarticles();
    }
    @DeleteMapping("/deleteAllArticles")
    public ResponseEntity<String> deleteAllArticles(){
        return deleteAllArticles.deleteAllArticle();
    }

    @DeleteMapping("/deleteArticleById")
    public ResponseEntity<String> deleteById(@RequestParam("Id") Long Id){
        return deleteArticleById.execute(Id);
    }
    @PostMapping("/newArticle")
    public ResponseEntity<article> addNewArticle(@Valid @RequestBody article newArticle){
        return addnewArticle.execute(newArticle);
    }
}
