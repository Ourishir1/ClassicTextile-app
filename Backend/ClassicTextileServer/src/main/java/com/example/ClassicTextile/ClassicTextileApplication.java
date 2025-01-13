package com.example.ClassicTextile;

import com.example.ClassicTextile.modules.ServerState;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication (exclude = SecurityAutoConfiguration.class)
public class ClassicTextileApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClassicTextileApplication.class, args);
	}

	@Bean
	public Map<String, ServerState> activeTokens(){
		return new HashMap<>();
	}

}
