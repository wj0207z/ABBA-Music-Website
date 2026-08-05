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

    public function update(
        Request $request,
        Comment $comment
    ): JsonResponse {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only edit your own comments.',
            ], 403);
        }

        $validated = $request->validate([
            'content' => [
                'required',
                'string',
                'max:1000',
            ],
        ]);

        $comment->update([
            'content' => $validated['content'],
        ]);

        return response()->json([
            'message' => 'Comment updated successfully.',
            'comment' => $comment->fresh()->load('user'),
        ]);
    }

    public function destroy(
        Request $request,
        Comment $comment
    ): JsonResponse {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only delete your own comments.',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully.',
        ]);
    }
}