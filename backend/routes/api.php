<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Public endpoint to get user info by ID
Route::get('/userinfo/{id}', [UserInfoController::class, 'getUserInfo']);

// Protected endpoint to get authenticated user info
Route::middleware('auth:sanctum')->get('/userinfo', [UserInfoController::class, 'getAuthUserInfo']);