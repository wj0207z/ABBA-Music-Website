package com.abba.dto;

public record UserResponse(
    Long id,
    String name,
    String email
) {}