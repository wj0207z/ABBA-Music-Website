<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(
        Request $request,
        Post $post
    ): JsonResponse {
        $user = $request->user();

        $existingLike = $post
            ->postLikes()
            ->where('user_id', $user->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            $post->postLikes()->create([
                'user_id' => $user->id,
            ]);

            $liked = true;
        }

        $likesCount = $post
            ->postLikes()
            ->count();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }

    public function likedPostIds(Request $request): JsonResponse
    {
        $postIds = $request
            ->user()
            ->postLikes()
            ->pluck('post_id')
            ->map(fn ($postId) => (int) $postId)
            ->values();

        return response()->json([
            'liked_post_ids' => $postIds,
        ]);
    }
}