package com.abba.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.abba.dto.UserResponse;
import com.abba.service.AuthService;


@RestController
public class AccountController {

    private final AuthService authService;

    public AccountController(AuthService authService) {
        this.authService = authService;
    }
    
    @GetMapping("/api/me")
    public UserResponse me(Principal principal) {
        return authService.getCurrentUser(principal.getName())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Account not found"
            ));
    }
}
