package com.abba.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
    @NotBlank
    @Size (max = 255, message = "Author name must be less than 255 characters")
    String author,

    @NotBlank
    @Size (max = 2000, message = "Content must not be more than 2000 characters")
    String content
) {}