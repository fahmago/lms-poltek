<?php

use App\Http\Controllers\LandingPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingPageController::class, 'index'])->name('landing.index');
require __DIR__ . '/authentication.php';
Route::prefix('my')->middleware(['auth'])->group(function() {        
    require __DIR__ . '/menu_dashboard.php';
    require __DIR__ . '/authorization.php';
    require __DIR__ . '/menu_admin.php';
    require __DIR__ . '/menu_dosen.php';
    require __DIR__ . '/menu_mahasiswa.php';
});
