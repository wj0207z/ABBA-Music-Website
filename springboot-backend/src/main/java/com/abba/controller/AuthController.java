package com.abba.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.abba.dto.RegisterRequest;
import com.abba.dto.UserResponse;
import com.abba.exception.RegistrationConflictException;
import com.abba.service.AuthService;

import jakarta.validation.Valid;


@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/api/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
        @Valid @RequestBody RegisterRequest request
    ) {
        try{
            return authService.register(request);
        } catch (RegistrationConflictException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                exception.getMessage()
            );
        }
    }
    
    
}
