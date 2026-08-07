<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = Room::with('creator')
            ->latest()
            ->get();

        return response()->json($rooms);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:rooms,name',
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ]);

        $room = Room::create([
            'created_by' => $request->user()->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Room created successfully.',
            'room' => $room->load('creator'),
        ], 201);
    }

    public function show(Room $room): JsonResponse
    {
        return response()->json(
            $room->load('creator')
        );
    }
}