package com.portfolio.api.controller;

import com.portfolio.api.dto.ContactRequest;
import jakarta.servlet.http.HttpServletRequest;
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
import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // --- Validation limits ---
    private static final int MAX_NAME_LEN = 100;
    private static final int MAX_EMAIL_LEN = 254;
    private static final int MAX_MESSAGE_LEN = 5000;
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // --- Simple in-memory per-IP rate limiter ---
    // Fine for a single-instance droplet deployment. If this ever runs behind
    // multiple app instances, replace with a shared store (e.g. Redis).
    private static final int MAX_REQUESTS_PER_WINDOW = 5;
    private static final Duration RATE_WINDOW = Duration.ofMinutes(15);
    private static final ConcurrentHashMap<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    @Value("${MAIL_USERNAME}")
    private String recipientEmail;

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${RESEND_FROM_EMAIL:onboarding@resend.dev}")
    private String fromEmail;

    @PostMapping
    public ResponseEntity<String> handleContactSubmit(
            @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = resolveClientIp(httpRequest);

        // --- Honeypot: legitimate users never fill this hidden field ---
        if (request.getWebsite() != null && !request.getWebsite().isBlank()) {
            logger.warn("Honeypot triggered from IP {} — silently discarding", clientIp);
            // Return success so bots don't learn the field is a trap.
            return ResponseEntity.ok("Message sent successfully.");
        }

        // --- Rate limit ---
        if (isRateLimited(clientIp)) {
            logger.warn("Rate limit exceeded for IP {}", clientIp);
            return ResponseEntity.status(429).body("Too many requests. Please try again later.");
        }

        // --- Validation ---
        String validationError = validate(request);
        if (validationError != null) {
            logger.info("Rejected contact submission from IP {}: {}", clientIp, validationError);
            return ResponseEntity.badRequest().body(validationError);
        }

        String name = request.getName().trim();
        String email = request.getEmail().trim();
        String messageText = request.getMessage().trim();

        logger.info("Received contact request from IP {}: {}", clientIp, name);

        String subject = "New Portfolio Contact " + name;
        String body = "You got contacted by " + name + " through the portfolio site\n"
                + "Their Email was: " + email + "\n\n"
                + name + "'s message was \n" + messageText;

        String json = "{"
                + "\"from\":\"" + escapeJson(fromEmail) + "\","
                + "\"to\":[\"" + escapeJson(recipientEmail) + "\"],"
                + "\"reply_to\":\"" + escapeJson(email) + "\","
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"text\":\"" + escapeJson(body) + "\""
                + "}";

        try {
            HttpRequest resendRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(10))
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(resendRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("Email successfully sent for request from: {}", name);
                return ResponseEntity.ok("Message sent successfully.");
            } else {
                logger.error("Resend API returned {}: {}", response.statusCode(), response.body());
                return ResponseEntity.status(502).body("Error while sending mail.");
            }
        } catch (Exception e) {
            logger.error("Failed to send email from {}", email, e);
            return ResponseEntity.status(500).body("Error while sending mail.");
        }
    }

    private String validate(ContactRequest request) {
        if (request == null) {
            return "Request body is required.";
        }
        String name = request.getName();
        String email = request.getEmail();
        String message = request.getMessage();

        if (isBlank(name)) return "Name is required.";
        if (name.trim().length() > MAX_NAME_LEN) return "Name is too long.";

        if (isBlank(email)) return "Email is required.";
        if (email.trim().length() > MAX_EMAIL_LEN) return "Email is too long.";
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) return "Email address is invalid.";

        if (isBlank(message)) return "Message is required.";
        if (message.trim().length() > MAX_MESSAGE_LEN) return "Message is too long.";

        return null;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private boolean isRateLimited(String clientIp) {
        Instant now = Instant.now();
        Instant windowStart = now.minus(RATE_WINDOW);

        Deque<Instant> timestamps = requestLog.computeIfAbsent(clientIp, k -> new ConcurrentLinkedDeque<>());

        // Drop expired entries
        while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(windowStart)) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= MAX_REQUESTS_PER_WINDOW) {
            return true;
        }

        timestamps.addLast(now);
        return false;
    }

    private static String resolveClientIp(HttpServletRequest request) {
        // Nginx is configured to forward the real client IP via X-Forwarded-For.
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // First entry is the original client.
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
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