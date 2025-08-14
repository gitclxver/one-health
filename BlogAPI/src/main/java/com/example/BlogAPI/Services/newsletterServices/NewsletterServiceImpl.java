package com.example.BlogAPI.Services.newsletterServices;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.BlogAPI.Models.Article;
import com.example.BlogAPI.Models.NewsletterSubscriber;
import com.example.BlogAPI.Repositories.ArticleRepository;
import com.example.BlogAPI.Repositories.NewsletterRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

@Service
public class NewsletterServiceImpl implements NewsletterService {

    private final NewsletterRepository newsletterRepository;
    private final ArticleRepository articleRepository;
    private final JavaMailSender mailSender;
    private final Validator validator;

    @Autowired
    private Environment env;

    @Autowired
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
        NewsletterSubscriber temp = new NewsletterSubscriber(email);
        Set<ConstraintViolation<NewsletterSubscriber>> violations = validator.validateProperty(temp, "email");

        if (!violations.isEmpty()) {
            throw new IllegalArgumentException("Invalid email format");
        }

        Optional<NewsletterSubscriber> existing = newsletterRepository.findByEmail(email);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already subscribed");
        }

        return newsletterRepository.save(temp);
    }

    @Override
    public List<NewsletterSubscriber> getAllSubscribers() {
        return newsletterRepository.findAll();
    }

    @Override
    public NewsletterSubscriber toggleSubscriberStatus(Long id) {
        NewsletterSubscriber subscriber = newsletterRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Subscriber not found"));

        subscriber.setActive(!subscriber.isActive());
        return newsletterRepository.save(subscriber);
    }

    @Override
    public void sendNewsletter(Long articleId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new IllegalArgumentException("Article not found"));

        String subject = "📰 " + article.getTitle();

        List<NewsletterSubscriber> activeSubscribers = newsletterRepository.findAll()
            .stream()
            .filter(NewsletterSubscriber::isActive)
            .collect(Collectors.toList());

        for (NewsletterSubscriber sub : activeSubscribers) {
            String content = generateEmailBody(article, sub);
            try {
                sendEmail(sub.getEmail(), subject, content);
            } catch (MessagingException e) {
                e.printStackTrace();
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
                <a href="https://nustonehealthsociety.org/article/%s" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">Read Full Article</a>
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


    private void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom(env.getProperty("spring.mail.username"));

        mailSender.send(message);
    }
}
