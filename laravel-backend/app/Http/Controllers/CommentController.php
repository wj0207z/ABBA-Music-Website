<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Post $post): JsonResponse
    {
        $comments = $post
            ->comments()
            ->with('user')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(
        Request $request,
        Post $post
    ): JsonResponse {
        $validated = $request->validate([
            'content' => [
                'required',
                'string',
                'max:1000',
            ],
        ]);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'message' => 'Comment created successfully.',
            'comment' => $comment->load('user'),
        ], 201);
    }
}