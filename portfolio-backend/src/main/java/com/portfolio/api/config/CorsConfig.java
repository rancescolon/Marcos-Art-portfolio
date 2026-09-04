package com.portfolio.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "https://createdbypvo.online",
                                "https://www.createdbypvo.online"
                                // Removed http://localhost:3000 for the deployed
                                // build. Keep it only in a dev/local profile if
                                // you still need it while developing.
                        )
                        .allowedMethods("POST", "OPTIONS")
                        // Narrowed from "*" — only Content-Type is actually
                        // needed for a JSON POST from the browser.
                        .allowedHeaders("Content-Type")
                        .maxAge(3600);
            }
        };
    }
}