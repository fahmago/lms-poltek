<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use Illuminate\Support\Facades\Route;


Route::get('/signin', [LoginController::class, 'index'])->name('login')->middleware('guest');
Route::post('/signin', [LoginController::class, 'store2'])->name('login.store')->middleware('guest');
Route::post('/signout', LogoutController::class)->name('logout')->middleware('auth');