package com.abba.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class AccountController {
    
    @GetMapping("/api/me")
    public Map<String, String> me(Principal principal) {
        return Map.of(
            "email", principal.getName());
    }
    
}
