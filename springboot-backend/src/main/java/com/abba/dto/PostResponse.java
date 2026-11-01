package com.abba.dto;

public record PostResponse(
    Long id,
    String author,
    String content
) {}
