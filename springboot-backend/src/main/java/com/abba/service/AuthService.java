package com.abba.service;

import java.util.Locale;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.abba.dto.RegisterRequest;
import com.abba.dto.UserResponse;
import com.abba.entity.User;
import com.abba.exception.RegistrationConflictException;
import com.abba.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    //To register users, this service needs a user repository and a password encoder.
    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new RegistrationConflictException(
                "Email is already registered"
            );
        }

        String hash = passwordEncoder.encode(request.password());

        User user = new User(
            request.name().strip(),
            email,
            hash
        );

        User savedUser;

        try {
            savedUser = userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            throw new RegistrationConflictException(
                "Registration conflict while existing data"
            );
        }

        return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail()
        );
    }

}
