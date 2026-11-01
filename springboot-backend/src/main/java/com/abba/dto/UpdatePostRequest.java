package com.abba.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePostRequest(
    @NotBlank
    @Size(max = 2000)
    String content
) {
}
