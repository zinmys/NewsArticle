<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api;

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

Route::post('register', Api\RegisterController::class)->name('register');
Route::post('login', Api\LoginController::class)->name('login');
Route::get('credentials', Api\ClientCredentialsController::class)->name('credentials');

//API to test
Route::get('news-api', [App\Http\Controllers\NewsApiController::class,'everything'])->name('news-api');
Route::get('news-api/top-headlines', [App\Http\Controllers\NewsApiController::class,'topHeadlines'])->name('news-api/top-headlines');
Route::get('news-api/sources', [App\Http\Controllers\NewsApiController::class,'sources'])->name('news-api/sources');
Route::get('guardian-api', [App\Http\Controllers\TheGuardianController::class, 'content'])->name('guardian-api');
Route::get('guardian-api/category', [App\Http\Controllers\TheGuardianController::class, 'category'])->name('guardian-category');

Route::group(['middleware' => ['client']], function() {
    Route::get('news-articles/top-news', [Api\NewsArticleController::class, 'topNews'])->name('news-articles/top-news');
    Route::get('news-articles/recent-news', [Api\NewsArticleController::class, 'recentNews'])->name('news-articles/recent-news');
    Route::get('news-articles/search', [Api\NewsArticleController::class, 'search'])->name('news-articles/search');
    Route::get('news-articles/source', [Api\NewsArticleController::class, 'source'])->name('news-articles/source');
    Route::get('news-articles/category', [Api\NewsArticleController::class, 'category'])->name('news-articles/category');
});

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('user', function (Request $request) {
        return $request->user();
    });
    Route::resource('personalize', App\Http\Controllers\UserController::class);
});