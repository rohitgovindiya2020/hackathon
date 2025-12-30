<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InterestController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\BookingController;

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

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Services (Placeholders for now, ServiceController to be fully implemented)
    Route::apiResource('services', ServiceController::class);
    
    // Discounts (Placeholders for now, DiscountController to be fully implemented)
    Route::apiResource('discounts', DiscountController::class);

    // Interests
    Route::post('/interests', [InterestController::class, 'store']);
    Route::delete('/interests/{id}', [InterestController::class, 'destroy']);
    Route::get('/my-interests', [InterestController::class, 'myInterests']);

    // Bookings (Placeholders for now, BookingController to be fully implemented)
    Route::apiResource('bookings', BookingController::class);
});

// Areas (Public for registration)
Route::get('/areas', function() {
    return response()->json(['areas' => \App\Models\Area::all()]);
});

// Dynamic Location Routes
Route::get('/countries', [\App\Http\Controllers\Api\LocationController::class, 'getCountries']);
Route::get('/countries/{country}/states', [\App\Http\Controllers\Api\LocationController::class, 'getStates']);
Route::get('/states/{state}/cities', [\App\Http\Controllers\Api\LocationController::class, 'getCities']);
Route::get('/cities/{city}/areas', [\App\Http\Controllers\Api\LocationController::class, 'getAreas']);
