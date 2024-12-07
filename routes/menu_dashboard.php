<?php

use App\Http\Controllers\My\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', DashboardController::class)->middleware('mhs_profile_complete')->name('my.dashboard.index');