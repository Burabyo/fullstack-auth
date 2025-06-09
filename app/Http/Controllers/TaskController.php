<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
                       ->tasks()
                       ->orderBy('created_at', 'desc')
                       ->get();
    }

    public function store(Request $request)
    {
        $request->validate(['title' => 'required|string|max:255']);
        $task = $request->user()->tasks()->create([
            'title'     => $request->title,
            'completed' => false,
        ]);
        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate(['completed' => 'required|boolean']);
        // Optional: $this->authorize('update', $task);
        $task->update(['completed' => $request->completed]);
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        // Optional: $this->authorize('delete', $task);
        $task->delete();
        return response()->json(null, 204);
    }
}
