<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::latest()->get();

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        $post = Post::create([
            'author' => $user->name,
            'content' => $validated['content'],
            'likes' => 0,
        ]);

        return response()->json([
            'message' => 'Post created successfully.',
            'post' => $post,
        ], 201);
    }
}