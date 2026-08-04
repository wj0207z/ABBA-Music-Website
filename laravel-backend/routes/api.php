<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;

Route::get('/health', function () {
    return response()->json([
        'message' => 'ABBA Laravel API is running',
        'status' => 'ok',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/posts', [PostController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/my-posts', [PostController::class, 'myPosts']);

    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);

    Route::post('/posts/{post}/like', [LikeController::class, 'toggle']);

    Route::get('/liked-post-ids', [LikeController::class, 'likedPostIds']);

});

Route::get('/posts/{post}/comments', [CommentController::class, 'index']
);