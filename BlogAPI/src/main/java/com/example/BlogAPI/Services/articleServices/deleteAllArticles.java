package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Exceptions.noArticleFoundException;
import com.example.BlogAPI.Repositories.articleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class deleteAllArticles{
    private final articleRepository articleRepo;

    public deleteAllArticles(articleRepository articleRepo) {
        this.articleRepo = articleRepo;
    }

    public ResponseEntity<String> deleteAllArticle(){
        try{
            articleRepo.deleteAll();
        }catch (RuntimeException e){
            throw new noArticleFoundException();
        }
        return ResponseEntity.ok().body("Successfully deleted all");
    }
}
