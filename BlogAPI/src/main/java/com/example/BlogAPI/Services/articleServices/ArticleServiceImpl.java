package com.example.BlogAPI.Services.articleServices;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Services.newsletterServices.NewsletterService;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private static final String UPLOAD_DIR = "uploads/articles/";

    private final NewsletterService newsletterService;

    public ArticleServiceImpl(ArticleRepository articleRepository, NewsletterService newsletterService) {
        this.articleRepository = articleRepository;
        this.newsletterService = newsletterService;
    }


    @Override
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    @Override
    public List<Article> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue();
    }

    @Override
    public List<Article> getFeaturedArticles() {
        return articleRepository.findByIsFeaturedTrueAndIsPublishedTrue();
    }

    @Override
    public Article createArticle(Article article) {
        article.setPublished(true);
        article.setPublishedAt(LocalDateTime.now());
        Article savedArticle = articleRepository.save(article);

        if (!savedArticle.isNewsletterSent()) {
            newsletterService.sendNewsletter(savedArticle.getId());
            savedArticle.setNewsletterSent(true);
            return articleRepository.save(savedArticle);
        }

        return savedArticle;
    }



    @Override
    public Article updateArticle(Long id, Article updatedArticle) {
        return articleRepository.findById(id).map(existing -> {
            existing.setTitle(updatedArticle.getTitle());
            existing.setDescription(updatedArticle.getDescription());
            existing.setContent(updatedArticle.getContent());
            if (updatedArticle.getImageUrl() != null && !updatedArticle.getImageUrl().trim().isEmpty()) {
                existing.setImageUrl(updatedArticle.getImageUrl());
            }
            existing.setFeatured(updatedArticle.isFeatured());
            return articleRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Override
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article not found");
        }
        articleRepository.findById(id).ifPresent(article -> {
            if (article.getImageUrl() != null && !article.getImageUrl().isEmpty()) {
                try {
                    String filename = Paths.get(article.getImageUrl()).getFileName().toString();
                    Path imagePath = Paths.get(UPLOAD_DIR + filename);
                    if (Files.exists(imagePath)) {
                        Files.delete(imagePath);
                    }
                } catch (IOException e) {
                    System.err.println("Failed to delete image: " + e.getMessage());
                }
            }
        });
        articleRepository.deleteById(id);
    }

    @Override
    public Article updateImageUrl(Long articleId, String imageUrl) {
        return articleRepository.findById(articleId).map(article -> {
            article.setImageUrl(imageUrl);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Override
    public Article publishArticle(Long articleId) {
        return articleRepository.findById(articleId).map(article -> {
            article.setPublished(true);
            article.setPublishedAt(LocalDateTime.now());

            if (!article.isNewsletterSent()) {
                newsletterService.sendNewsletter(articleId);
                article.setNewsletterSent(true);
            }

            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }


    @Override
    public String saveTempImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IOException("File is empty");

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) throw new IOException("Original filename is null");

        String extension = originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".jpg";

        String uniqueFilename = "temp-" + UUID.randomUUID() + extension;
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFilename;
    }

    @Override
    public String finalizeTempImage(String tempPath, Long articleId) throws IOException {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found with ID: " + articleId));

        String tempFilename = Paths.get(tempPath).getFileName().toString(); 
        Path tempFile = Paths.get("uploads/articles", tempFilename);

        if (!Files.exists(tempFile)) {
            throw new FileNotFoundException("Temp image not found: " + tempFilename);
        }

        String finalFilename = "article-" + articleId + "-" + UUID.randomUUID() + getFileExtension(tempFilename);
        Path finalFile = Paths.get("uploads/articles", finalFilename);

        Files.move(tempFile, finalFile, StandardCopyOption.REPLACE_EXISTING);

        String finalImageUrl = "/uploads/articles/" + finalFilename;
        article.setImageUrl(finalImageUrl);
        articleRepository.save(article);

        return finalImageUrl;
    }

    private String getFileExtension(String filename) {
        int index = filename.lastIndexOf('.');
        return (index > 0) ? filename.substring(index) : "";
    }


    @Override
    public void cleanupTempFiles() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (Files.exists(uploadPath)) {
                Files.list(uploadPath)
                    .filter(path -> path.getFileName().toString().startsWith("temp-"))
                    .filter(path -> {
                        try {
                            long fileAge = System.currentTimeMillis() - Files.getLastModifiedTime(path).toMillis();
                            return fileAge > 3600000;
                        } catch (IOException e) {
                            return false;
                        }
                    })
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            System.out.println("Deleted old temp file: " + path.getFileName());
                        } catch (IOException e) {
                            System.err.println("Failed to delete temp file: " + path.getFileName());
                        }
                    });
            }
        } catch (IOException e) {
            System.err.println("Failed to cleanup temp files: " + e.getMessage());
        }
    }

    @Override
    public Article setFeatured(Long articleId, boolean isFeatured) {
        return articleRepository.findById(articleId).map(article -> {
            article.setFeatured(isFeatured);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Override
    public Article uploadArticleImage(Long articleId, MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IOException("Image file is empty");
        }

        String originalFilename = image.getOriginalFilename();
        if (originalFilename == null) throw new IOException("Original filename is null");

        String extension = originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".jpg";

        String uniqueFilename = "article-" + articleId + "-" + UUID.randomUUID() + extension;
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String finalImageUrl = "/" + UPLOAD_DIR + uniqueFilename;
        return updateImageUrl(articleId, finalImageUrl);
    }

    @Override
    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    @Override
    public Article toggleFeature(Long articleId, boolean isFeatured) {
        return articleRepository.findById(articleId).map(article -> {
            article.setFeatured(isFeatured);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Override
    public Article togglePublishStatus(Long articleId) {
        return articleRepository.findById(articleId).map(article -> {
            boolean newStatus = !article.isPublished();
            article.setPublished(newStatus);
            if (newStatus) {
                article.setPublishedAt(LocalDateTime.now());
            } else {
                article.setPublishedAt(null);
            }
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Override
    public Article unpublishArticle(Long articleId) {
        return articleRepository.findById(articleId).map(article -> {
            article.setPublished(false);
            article.setPublishedAt(null);
            return articleRepository.save(article);
        }).orElseThrow(() -> new RuntimeException("Article not found"));
    }

}
