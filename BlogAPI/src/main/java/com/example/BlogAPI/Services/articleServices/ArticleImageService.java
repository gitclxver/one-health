package com.example.BlogAPI.Services.articleServices;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;

@Service
public class ArticleImageService {
    private final ArticleRepository articleRepository;
    
    @Value("${upload.directory}")
    private String uploadDirectory;

    public ArticleImageService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public String uploadImage(Long articleId, MultipartFile file) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        if (articleOptional.isEmpty()) {
            throw new RuntimeException("Article not found");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            // Update article with image URL
            Article article = articleOptional.get();
            String imageUrl = "/uploads/" + uniqueFilename;
            article.setImageUrl(imageUrl);
            articleRepository.save(article);

            return imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}