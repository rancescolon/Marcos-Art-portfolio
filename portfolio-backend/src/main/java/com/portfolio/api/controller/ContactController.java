package com.portfolio.api.controller;

import com.portfolio.api.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private JavaMailSender mailSender;

    // Pulls the email from application.properties
    @Value("${MAIL_USERNAME}")
    private String recipientEmail;

    @PostMapping
    public ResponseEntity<String> handleContactSubmit(@RequestBody ContactRequest request) {

        SimpleMailMessage message = new SimpleMailMessage();

        logger.info("Received contact request from: {}", request.getName());
        logger.info("Sender email: {}", request.getEmail());
        logger.debug("Message content: {}", request.getMessage());// only see in debugger

        message.setTo(recipientEmail);
        message.setSubject("New Portfolio Contact " + request.getName());
        message.setText("You got contacted by " + request.getName() + " through the portfolio site\n" +
                "Their Email was: " + request.getEmail() + "\n\n" +
                request.getName() + "'s message was \n" + request.getMessage());

        try {
            mailSender.send(message);
            logger.info("Email successfully sent for request from: {}", request.getName());
            return ResponseEntity.ok("Message sent successfully.");
        } catch (Exception e) {
            logger.error("Failed to send email from {}", request.getEmail(), e);
            return ResponseEntity.status(500).body("Error while sending mail.");
        }
    }
}