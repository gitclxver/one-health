package com.example.BlogAPI.Services.articleServices;

import com.example.BlogAPI.Exceptions.noArticleFoundException;
import com.example.BlogAPI.Repositories.Command;
import com.example.BlogAPI.Repositories.articleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class deleteArticleById implements Command<Long,String> {
    private final articleRepository articleRepo;

    public deleteArticleById(articleRepository articleRepo) {
        this.articleRepo = articleRepo;
    }

    @Override
    public ResponseEntity<String> execute(Long input) {
        try {
            articleRepo.deleteById(input);
        }catch (RuntimeException e){
            throw new noArticleFoundException();
        }
        return ResponseEntity.ok().body("Successfully deleted");
    }
}
