package com.abba.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.abba.dto.CreatePostRequest;
import com.abba.dto.PostResponse;
import com.abba.dto.UpdatePostRequest;
import com.abba.entity.Post;
import com.abba.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPosts() {
        List<Post> posts = postRepository.findAll(
            Sort.by(Sort.Direction.DESC, "id")
        );

        List<PostResponse> responses = new ArrayList<>();

        for (Post post : posts) {
            responses.add(
                new PostResponse(
                    post.getId(),
                    post.getAuthor(),
                    post.getContent()
                )
            );
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public Optional<PostResponse> getPost(Long id) {
        return postRepository.findById(id)
            .map(post -> new PostResponse(
                post.getId(),
                post.getAuthor(),
                post.getContent()
            )
        );
    }

    @Transactional
    public PostResponse createPost(CreatePostRequest request){
        Post post = new Post(
            request.author(),
            request.content()
        );

        Post savedPost = postRepository.save(post);

        return new PostResponse(
            savedPost.getId(),
            savedPost.getAuthor(),
            savedPost.getContent()
        );
    }

    @Transactional
    public Optional<PostResponse> updatePost(
        Long id,
        UpdatePostRequest request
    ) {
        return postRepository.findById(id)
            .map(post -> {
                post.updateContent(request.content());

                Post savedPost = postRepository.save(post);

                return new PostResponse(
                    savedPost.getId(),
                    savedPost.getAuthor(),
                    savedPost.getContent()
                );
            }
        );
    }

    @Transactional
    public boolean deletePost(Long id) {
        Optional<Post> result = postRepository.findById(id);

        if (result.isEmpty()) {
            return false;
        } 
        
        postRepository.delete(result.get());
        return true;
    }
}