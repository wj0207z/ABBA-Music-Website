package com.abba.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.abba.dto.CreatePostRequest;
import com.abba.dto.PostResponse;
import com.abba.dto.UpdatePostRequest;
import com.abba.entity.Post;
import com.abba.entity.User;
import com.abba.repository.PostRepository;
import com.abba.repository.UserRepository;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(
        PostRepository postRepository,
        UserRepository userRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
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
    public PostResponse createPost(
        CreatePostRequest request,
        String authenticatedEmail
    ){
        User user = userRepository.findByEmail(authenticatedEmail)
            .orElseThrow(() -> new BadCredentialsException(
                "Account is no longer available"
            ));

        Post post = new Post(
            user.getId(),
            user.getName(),
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
        UpdatePostRequest request,
        String authenticatedEmail
    ) {
        return postRepository.findById(id)
            .map(post -> {
                requireOwner(post, authenticatedEmail);

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
    public boolean deletePost(Long id, String authenticatedEmail) {
        Optional<Post> result = postRepository.findById(id);

        if (result.isEmpty()) {
            return false;
        }

        Post post = result.get();

        requireOwner(post, authenticatedEmail);

        postRepository.delete(post);
        return true;
    }

    private void requireOwner(Post post, String authenticatedEmail) {
        User user = userRepository.findByEmail(authenticatedEmail)
            .orElseThrow(() -> new BadCredentialsException(
                "Account is no longer available"
            ));

        if (!user.getId().equals(post.getUserId())) {
            throw new AccessDeniedException(
                "You can only modify your own posts"
            );
        }
    }
}