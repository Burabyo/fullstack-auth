<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tasks',    [TaskController::class, 'index']);
    Route::post('/tasks',   [TaskController::class, 'store']);
    Route::put('/tasks/{id}',    [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
  Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();  // revoke current token
        return response()->json(['message' => 'Logged out']);
    });

    Route::delete('/user', function (Request $request) {
        $user = $request->user();
        // Delete user and revoke tokens
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Account deleted']);
    });
});
