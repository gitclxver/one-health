package com.example.BlogAPI;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.example.BlogAPI.controllers.ArticleController;
import com.example.BlogAPI.controllers.AuthController;

@SpringBootTest
@ActiveProfiles("test")
class BlogApiApplicationTests {

    @Autowired
    private ArticleController articleController;

    @Autowired
    private AuthController authController;

    @Test
    public void contextLoads() {
        assertThat(articleController).isNotNull();
        assertThat(authController).isNotNull();
    }
}