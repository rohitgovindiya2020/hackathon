<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InterestController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ProviderServiceController;

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
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Services (Public)
Route::get('/services/by-name', [ServiceController::class, 'getByName']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/providers', [\App\Http\Controllers\Api\ServiceProviderController::class, 'index']);
Route::get('/providers/{id}', [\App\Http\Controllers\Api\ServiceProviderController::class, 'show']);
Route::get('/public/discounts', [DiscountController::class, 'publicList']);
Route::get('/search', [\App\Http\Controllers\Api\SearchController::class, 'globalSearch']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'update']);

    // Services (Protected)
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    
    // Discounts
    Route::get('/discounts/{id}/interests', [DiscountController::class, 'getInterests']);
    Route::get('/discounts/{discountId}/customers/{customerId}', [DiscountController::class, 'getCustomerDetails']);
    Route::post('/discounts/{discountId}/customers/{customerId}/promo-code', [DiscountController::class, 'submitPromoCode']);
    Route::post('/discounts/{discountId}/customers/{customerId}/approve-booking', [DiscountController::class, 'approveBooking']);
    Route::post('/discounts/{discountId}/customers/{customerId}/suggest-slot', [DiscountController::class, 'suggestAlternativeSlot']);
    Route::apiResource('discounts', DiscountController::class);

    // Interests
    Route::post('/interests', [InterestController::class, 'store']);
    Route::delete('/interests/{id}', [InterestController::class, 'destroy']);
    Route::get('/my-interests', [InterestController::class, 'myInterests']);
    Route::get('/my-interests/active-count', [InterestController::class, 'activeCount']);

    // Provider Services
    Route::get('/my-services', [ProviderServiceController::class, 'index']);
    Route::post('/my-services', [ProviderServiceController::class, 'store']);
    Route::delete('/my-services/{id}', [ProviderServiceController::class, 'destroy']);

    // Bookings (Placeholders for now, BookingController to be fully implemented)
    Route::apiResource('bookings', BookingController::class);

    // Reviews
    Route::post('/providers/{id}/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [\App\Http\Controllers\Api\ReviewController::class, 'update']);


    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::apiResource('customers', \App\Http\Controllers\Api\CustomerController::class);
        Route::apiResource('service-providers', \App\Http\Controllers\Api\ServiceProviderController::class);
        Route::apiResource('service-areas', \App\Http\Controllers\Api\ServiceAreaController::class);
        Route::get('settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
        Route::post('settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);
        Route::post('settings/test-email', [\App\Http\Controllers\Api\SettingController::class, 'testEmail']);
        Route::apiResource('admins', \App\Http\Controllers\Api\AdminController::class);
    });
});

// Areas (Public for registration)
Route::get('/areas', function() {
    return response()->json(['areas' => \App\Models\ServiceArea::all()]);
});

// Dynamic Location Routes
Route::get('/countries', [\App\Http\Controllers\Api\LocationController::class, 'getCountries']);
Route::get('/countries/{country}/states', [\App\Http\Controllers\Api\LocationController::class, 'getStates']);
Route::get('/states/{state}/cities', [\App\Http\Controllers\Api\LocationController::class, 'getCities']);
Route::get('/cities/{city}/areas', [\App\Http\Controllers\Api\LocationController::class, 'getAreas']);

// Service Areas (Dependent Dropdowns)
Route::get('/service-areas/countries', [App\Http\Controllers\Api\ServiceAreaController::class, 'getCountries']);
Route::get('/service-areas/states', [App\Http\Controllers\Api\ServiceAreaController::class, 'getStates']);
Route::get('/service-areas/cities', [App\Http\Controllers\Api\ServiceAreaController::class, 'getCities']);
Route::get('/service-areas/areas', [App\Http\Controllers\Api\ServiceAreaController::class, 'getAreas']);
