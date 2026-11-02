package com.abba.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePostRequest(
    @NotBlank
    @Size(max = 2000, message = "Content must not be more than 2000 characters")
    String content
) {
}
