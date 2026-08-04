<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::withCount(['comments', 'postLikes as likes_count'])
            ->latest()
            ->get();

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        $post = Post::create([
            'user_id' => $user->id,
            'author' => $user->name,
            'content' => $validated['content'],
            'likes' => 0,
        ]);

        return response()->json([
            'message' => 'Post created successfully.',
            'post' => $post->loadCount(['comments', 'postLikes as likes_count']),
        ], 201);
    }

    public function myPosts(Request $request): JsonResponse
    {
        $posts = $request
            ->user()
            ->posts()
            ->withCount(['comments', 'postLikes as likes_count'])
            ->latest()
            ->get();

        return response()->json($posts);
    }

    public function update(
        Request $request,
        Post $post
    ): JsonResponse {
        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only edit your own posts.',
            ], 403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $post->update([
            'content' => $validated['content'],
        ]);

        return response()->json([
            'message' => 'Post updated successfully.',
            'post' => $post->fresh(),
        ]);
    }

    public function destroy(
        Request $request,
        Post $post
    ): JsonResponse {
        if ($post->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own posts.',
            ], 403);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully.',
        ]);
    }
}