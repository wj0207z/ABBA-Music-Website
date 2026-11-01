package com.abba.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.abba.dto.CreatePostRequest;
import com.abba.dto.PostResponse;
import com.abba.dto.UpdatePostRequest;
import com.abba.service.PostService;

import jakarta.validation.Valid;


@RestController
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/api/posts")
    public List<PostResponse> getPosts() {
        return postService.getPosts();
    }

    @GetMapping("/api/posts/{id}")
    public PostResponse getPost(@PathVariable Long id) {
        return postService.getPost(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Post not found"
            ));
    }

    @PostMapping("/api/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(
        @Valid @RequestBody CreatePostRequest request) {
        return postService.createPost(request);
    }
    
    @PutMapping("/api/posts/{id}")
    public PostResponse updatePost(
        @PathVariable Long id,
        @Valid @RequestBody UpdatePostRequest request
    ) {
        return postService.updatePost(id, request)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Post not found"
            ));
    }

    @DeleteMapping("/api/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        boolean deleted = postService.deletePost(id);
        
        if (!deleted) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Post not found"
            );
        }
    }
}
