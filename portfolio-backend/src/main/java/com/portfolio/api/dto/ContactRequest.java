package com.portfolio.api.dto;

public class ContactRequest {
    private String name;
    private String email;
    private String message;

    // Honeypot field. Keep this hidden via CSS on the frontend form
    // (e.g. position: absolute; left: -9999px; and no label). Real users
    // never see or fill it in; bots that auto-fill every field will.
    private String website;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}