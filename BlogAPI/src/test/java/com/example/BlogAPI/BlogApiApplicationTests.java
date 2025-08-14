package com.example.BlogAPI;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.BlogAPI.controllers.ArticleController;
import com.example.BlogAPI.controllers.AuthController;

@SpringBootTest
class BlogApiApplicationTests {

	@Autowired
	private ArticleController myController;

	@Autowired
	private AuthController myService;

	@Test
	public void contextLoads() throws Exception {
		assertThat(myController).isNotNull();
		assertThat(myService).isNotNull();
	}

}
