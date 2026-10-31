package com.abba.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PostController {
    public record PostResponse(
        Long id,
        String author,
        String content
    ) {}

        @GetMapping("/api/posts")
        public List<PostResponse> index() {
            return List.of(
                new PostResponse(
                    1L,
                    "John Doe",
                    "Dancing Queen is best song in the world!"
                ),

                new PostResponse(
                    2L,
                    "Jane Smith",
                    "Anyone listen to Mamma Mia today?"
                )
            );
        }
        
}
