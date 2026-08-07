<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index(Room $room): JsonResponse
    {
        $messages = $room->messages()
            ->with('user:id,name,avatar')
            ->oldest()
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request, Room $room): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $message = Message::create([
            'room_id' => $room->id,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        $message->load('user:id,name,avatar');

        broadcast(new MessageSent($message));

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => $message->load('user:id,name,avatar'),
        ], 201);
    }
}