<?php

use App\Http\Controllers\My\Mahasiswa\AbsensiMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\KelasMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\MateriMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\ProfilMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\RegistrasiKelasController;
use App\Http\Controllers\My\Mahasiswa\TugasMahasiswaController;
use Illuminate\Support\Facades\Route;

Route::controller(ProfilMahasiswaController::class)->prefix('mhs/profil')->name('mhs.profil.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:mhs.pro.index');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:mhs.pro.index');
});

Route::middleware(['mhs_profile_complete'])->group(function () {
    
    Route::controller(RegistrasiKelasController::class)->prefix('mhs/reg')->name('mhs.reg.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.reg.index');
        Route::post('/', 'store')->name('store')->middleware('permission:mhs.reg.index');
    });

    Route::controller(KelasMahasiswaController::class)->prefix('mhs/kelas')->name('mhs.kls.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.kls.index');
        // Route::post('/', 'store')->name('store')->middleware('permission:mhs.reg.index');
    });

    Route::controller(TugasMahasiswaController::class)->prefix('mhs/tugas')->name('mhs.tgs.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.tgs.index');
        Route::get('/class/{kode_kelas}/tugas', 'showTugas')->name('showTugas')->middleware('permission:mhs.tgs.show');
        Route::post('/sendTugas', 'sendTugas')->name('sendTugas')->middleware('permission:mhs.tgs.show');
    });

    Route::controller(AbsensiMahasiswaController::class)->prefix('mhs/absensi')->name('mhs.abs.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.abs.index');
        Route::get('/class/{kode_kelas}/presence', 'showPresence')->name('showPresence')->middleware('permission:mhs.abs.presence');
        Route::post('/doPresence', 'doPresence')->name('doPresence')->middleware('permission:mhs.abs.presence');
    });

    Route::controller(MateriMahasiswaController::class)->prefix('mhs/materi')->name('mhs.mtr.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.mtr.index');
        Route::get('/class/{kode_kelas}/materi', 'showMateri')->name('show')->middleware('permission:mhs.mtr.show');
    });

});


