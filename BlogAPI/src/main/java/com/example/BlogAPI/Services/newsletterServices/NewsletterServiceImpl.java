package com.example.BlogAPI.Services.newsletterServices;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Models.NewsletterSubscriber;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Repositories.NewsletterRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;


@Service
public class NewsletterServiceImpl implements NewsletterService {

    private static final Logger log = LoggerFactory.getLogger(NewsletterServiceImpl.class);

    private final NewsletterRepository newsletterRepository;
    private final ArticleRepository articleRepository;
    private final JavaMailSender mailSender;
    private final Validator validator;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${mail.sender.name}")
    private String senderName;

    public NewsletterServiceImpl(
        NewsletterRepository newsletterRepository,
        ArticleRepository articleRepository,
        JavaMailSender mailSender
    ) {
        this.newsletterRepository = newsletterRepository;
        this.articleRepository = articleRepository;
        this.mailSender = mailSender;
        this.validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Override
    public NewsletterSubscriber addSubscriber(String email) throws IllegalArgumentException {
        log.info("📬 Attempting to add subscriber with email: {}", email);

        Optional<NewsletterSubscriber> existing = newsletterRepository.findByEmail(email);
        if (existing.isPresent()) {
            log.warn("⚠️ Email already subscribed: {}", email);
            throw new IllegalArgumentException("Email already subscribed");
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber(email);
        Set<ConstraintViolation<NewsletterSubscriber>> violations = validator.validateProperty(subscriber, "email");

        if (!violations.isEmpty()) {
            log.warn("❌ Email validation failed: {}", email);
            throw new IllegalArgumentException("Invalid email format");
        }

        NewsletterSubscriber saved = newsletterRepository.save(subscriber);

        try {
            sendVerificationEmail(saved);
        } catch (MessagingException e) {
            log.error("❌ Failed to send verification email: {}", e.getMessage());
            throw new IllegalArgumentException("Failed to send verification email");
        }

        log.info("📨 Verification email sent to {}", saved.getEmail());
        return saved;
    }


    @Override
    public List<NewsletterSubscriber> getAllSubscribers() {
        log.info("📋 Retrieving all newsletter subscribers...");
        return newsletterRepository.findAll();
    }

    @Override
    public NewsletterSubscriber toggleSubscriberStatus(Long id) {
        log.info("🔄 Toggling subscription status for ID: {}", id);

        NewsletterSubscriber subscriber = newsletterRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("❌ Subscriber not found with ID: {}", id);
                return new IllegalArgumentException("Subscriber not found");
            });

        subscriber.setActive(!subscriber.isActive());
        NewsletterSubscriber updated = newsletterRepository.save(subscriber);

        log.info("✅ Subscriber status updated: {} is now {}", 
                 updated.getEmail(), updated.isActive() ? "active" : "inactive");

        return updated;
    }

    @Override
    public void sendNewsletter(Long articleId) {
        log.info("📨 Sending newsletter for article ID: {}", articleId);

        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> {
                log.error("❌ Article not found with ID: {}", articleId);
                return new IllegalArgumentException("Article not found");
            });

        String subject = "📰 " + article.getTitle();

        List<NewsletterSubscriber> activeSubscribers = newsletterRepository.findAll()
            .stream()
            .filter(sub -> sub.isActive() && sub.isVerified())
            .collect(Collectors.toList());

        log.info("📧 Sending to {} active subscriber(s)", activeSubscribers.size());

        for (NewsletterSubscriber sub : activeSubscribers) {
            String content = generateEmailBody(article, sub);
            try {
                log.info("➡️ Sending email to {}", sub.getEmail());
                sendEmail(sub.getEmail(), subject, content);
                log.info("✅ Email sent to {}", sub.getEmail());
            } catch (MessagingException e) {
                log.error("❌ Failed to send email to {}: {}", sub.getEmail(), e.getMessage(), e);
            }
        }
    }

    private String generateEmailBody(Article article, NewsletterSubscriber subscriber) {
        String unsubscribeUrl = "https://nustonehealthsociety.org/unsubscribe?email=" + subscriber.getEmail();

        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                <h2>📰 %s</h2>
                <p><strong>Description:</strong> %s</p>
                <hr />
                <a href="https://nustonehealthsociety.org/articles/%s" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Read Full Article</a>
                <br /><br />
                <p style="font-size: 12px; color: #777;">
                    Don't want to receive emails from us? <a href="%s">Unsubscribe</a>.
                </p>
            </body>
            </html>
        """.formatted(
            article.getTitle(),
            article.getDescription(),
            article.getId(),
            unsubscribeUrl
        );
    }

    @Async
    private void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(new InternetAddress(senderEmail, senderName)); 
        } catch (UnsupportedEncodingException e) {
            throw new MessagingException("Failed to encode sender name", e);
        }

        mailSender.send(message);
    }

    private void sendVerificationEmail(NewsletterSubscriber subscriber) throws MessagingException {
        // Rate limit check
        if (subscriber.getLastVerificationEmailSentAt() != null &&
            subscriber.getLastVerificationEmailSentAt().isAfter(LocalDateTime.now().minusMinutes(2))) {
            throw new MessagingException("Verification email was sent recently. Please wait before retrying.");
        }

        // Update the timestamp (token is already set in the model)
        subscriber.setLastVerificationEmailSentAt(LocalDateTime.now());
        subscriber.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
        newsletterRepository.save(subscriber); // persist changes

        String verifyUrl = "https://nustonehealthsociety.org/verify?token=" + subscriber.getVerificationToken();

        String subject = "Confirm Your Subscription";
        String content = """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Confirm Your Email Subscription</h2>
                <p>Click the link below to confirm your email address:</p>
                <a href="%s" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    This link will expire in 30 minutes.
                </p>
            </body>
            </html>
        """.formatted(verifyUrl);

        sendEmail(subscriber.getEmail(), subject, content);
        log.info("📨 Sent verification email to {} with token {}", subscriber.getEmail(), subscriber.getVerificationToken());
    }
    
    @Override
    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void removeExpiredUnverifiedSubscribers() {
        newsletterRepository.deleteExpiredUnverified();
        log.info("🧹 Cleaned expired unverified subscribers.");
    }

    @Override
    public void unsubscribe(String email) {
        Optional<NewsletterSubscriber> subscriberOpt = newsletterRepository.findByEmail(email);
        if (subscriberOpt.isPresent()) {
            newsletterRepository.deleteByEmail(email);
            log.info("🗑️ Unsubscribed and deleted email: {}", email);
        } else {
            log.warn("⚠️ Attempted to unsubscribe non-existent email: {}", email);
        }
    }

    @Override
    public Map<String, Object> verifySubscriberToken(String token) {
        log.info("🔍 Verifying token: {}", token);
        log.info("🕒 Current server time: {}", LocalDateTime.now());

        Optional<NewsletterSubscriber> optional = newsletterRepository.findByVerificationToken(token);

        if (optional.isEmpty()) {
            log.warn("⚠️ Invalid verification token: {}", token);
            return Map.of(
                "status", "error",
                "message", "Invalid verification token",
                "verified", false,
                "timestamp", LocalDateTime.now().toString()
            );
        }

        NewsletterSubscriber subscriber = optional.get();
        log.info("📧 Found subscriber: {}", subscriber.getEmail());
        log.info("🔄 Verification status: {}", subscriber.isVerified());
        log.info("⏳ Token expiry: {}", subscriber.getTokenExpiry());

        if (subscriber.isVerified()) {
            log.info("ℹ️ Subscriber already verified: {}", subscriber.getEmail());
            return Map.of(
                "status", "success",
                "message", "Email already verified",
                "verified", true,
                "timestamp", LocalDateTime.now().toString()
            );
        }

        if (subscriber.getTokenExpiry() == null) {
            log.warn("⚠️ No expiry time set for token: {}", token);
            return Map.of(
                "status", "error",
                "message", "Token has no expiry date",
                "verified", false,
                "timestamp", LocalDateTime.now().toString()
            );
        }

        if (subscriber.getTokenExpiry().isBefore(LocalDateTime.now())) {
            log.warn("⏰ Verification token expired for: {}", subscriber.getEmail());
            return Map.of(
                "status", "error",
                "message", "Token has expired",
                "verified", false,
                "timestamp", LocalDateTime.now().toString()
            );
        }

        // Verification successful
        subscriber.setVerified(true);
        subscriber.setVerificationToken(null);
        subscriber.setTokenExpiry(null);
        newsletterRepository.save(subscriber);
        log.info("✅ Subscriber verified: {}", subscriber.getEmail());
        
        return Map.of(
            "status", "success",
            "message", "Verification successful!",
            "verified", true,
            "timestamp", LocalDateTime.now().toString()
        );
    }
}
