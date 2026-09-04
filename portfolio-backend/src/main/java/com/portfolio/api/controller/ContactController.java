package com.portfolio.api.controller;

import com.portfolio.api.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // Recipient inbox for contact form submissions
    @Value("${MAIL_USERNAME}")
    private String recipientEmail;

    // Resend API key (create at https://resend.com/api-keys)
    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    // Verified sender address. Until you verify a domain on Resend, you
    // must use their shared test sender: onboarding@resend.dev
    @Value("${RESEND_FROM_EMAIL:onboarding@resend.dev}")
    private String fromEmail;

    @PostMapping
    public ResponseEntity<String> handleContactSubmit(@RequestBody ContactRequest request) {

        logger.info("Received contact request from: {}", request.getName());
        logger.info("Sender email: {}", request.getEmail());
        logger.debug("Message content: {}", request.getMessage());

        String subject = "New Portfolio Contact " + request.getName();
        String body = "You got contacted by " + request.getName() + " through the portfolio site\n"
                + "Their Email was: " + request.getEmail() + "\n\n"
                + request.getName() + "'s message was \n" + request.getMessage();

        String json = "{"
                + "\"from\":\"" + escapeJson(fromEmail) + "\","
                + "\"to\":[\"" + escapeJson(recipientEmail) + "\"],"
                + "\"reply_to\":\"" + escapeJson(request.getEmail()) + "\","
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"text\":\"" + escapeJson(body) + "\""
                + "}";

        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("Email successfully sent for request from: {}", request.getName());
                return ResponseEntity.ok("Message sent successfully.");
            } else {
                logger.error("Resend API returned {}: {}", response.statusCode(), response.body());
                return ResponseEntity.status(502).body("Error while sending mail.");
            }
        } catch (Exception e) {
            logger.error("Failed to send email from {}", request.getEmail(), e);
            return ResponseEntity.status(500).body("Error while sending mail.");
        }
    }

    private static String escapeJson(String value) {
        if (value == null) return "";
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}