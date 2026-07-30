<?php

use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\My\LaporanSklMahasiswaController;
use App\Http\Controllers\My\Pengaturan\KeamananController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingPageController::class, 'index'])->name('landing.index');
Route::get('/prodi/{kode_prodi}/matkul', [LandingPageController::class, 'show'])->name('landing.show.matkul.prodi');
require __DIR__ . '/authentication.php';
Route::prefix('my')->middleware(['auth'])->group(function() {        
    require __DIR__ . '/menu_dashboard.php';
    require __DIR__ . '/authorization.php';
    require __DIR__ . '/menu_admin.php';
    require __DIR__ . '/menu_dosen.php';
    require __DIR__ . '/menu_mahasiswa.php';
    Route::controller(KeamananController::class)->prefix('ganti/password')->name('my.pw.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/proses', 'updatePassword')->name('updatePassword');
    });
    Route::controller(LaporanSklMahasiswaController::class)->prefix('laporan/skl')->name('my.lap.')->group(function () {
        // Route::get('/{mahasiswaUuid}/{nim}', 'laporanSklMahasiswa')->name('detail');
        // Route::get('/{mahasiswaUuid}/{nim}', 'laporanSklMahasiswa')->name('detail')->middleware('permission:view.lihat.skl');
        Route::get('/{mahasiswaUuid}', 'laporanSklMahasiswa')->name('index')->middleware('permission:mhs.lihat.skl');
    });
});