<?php

use App\Http\Controllers\My\Dosen\JadwalDosenController;
use App\Http\Controllers\My\Dosen\KelasDosenController;
use App\Http\Controllers\My\Dosen\MateriDosenController;
use App\Http\Controllers\My\Dosen\TugasDosenController;
use Illuminate\Support\Facades\Route;

Route::controller(KelasDosenController::class)->prefix('d/kelas')->name('dsn.kelas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.kls.index');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dsn.kls.enroll');
    Route::get('/{uuid}/mhsList', 'show')->name('show')->middleware('permission:dsn.kls.show');
    Route::get('/{uuid}/viewMhs', 'viewMhs')->name('viewMhs')->middleware('permission:dsn.mhs.view');
    // Route::get('/create', 'create')->name('create')->middleware('permission:angkatans.create');
    // Route::post('/', 'store')->name('store')->middleware('permission:angkatans.create');
    // Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:angkatans.edit');
});

Route::controller(MateriDosenController::class)->prefix('d/materi')->name('dsn.materi.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.mtr.index');
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:dsn.mtr.show');
    Route::get('/create', 'create')->name('create')->middleware('permission:dsn.mtr.create');
    Route::post('/', 'store')->name('store')->middleware('permission:dsn.mtr.create');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dsn.mtr.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:dsn.mtr.delete');
});

Route::controller(TugasDosenController::class)->prefix('d/tugas')->name('dsn.tugas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.tgs.index');
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:dsn.tgs.show');
    Route::get('/create', 'create')->name('create')->middleware('permission:dsn.tgs.create');
    Route::post('/', 'store')->name('store')->middleware('permission:dsn.tgs.create');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dsn.tgs.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:dsn.tgs.delete');
    Route::get('{uuid}/respon', 'responTugas')->name('responTugas')->middleware('permission:dsn.tgs.index');
    Route::post('{uuid}/feedBack', 'feedBackTugas')->name('feedBackTugas')->middleware('permission:dsn.tgs.index');
    Route::delete('/respon/delete/{uuid}', 'deleteRespon')->name('deleteRespon')->middleware('permission:dsn.tgs.index');
});

Route::controller(JadwalDosenController::class)->prefix('d/schedules')->name('dsn.jdwl.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.jdwl.index');
    Route::get('/class/{kode_kelas}/show', 'show')->name('show')->middleware('permission:dsn.jdwl.show');
    Route::put('/{uuid}', 'update')->name('updateJadwal')->middleware('permission:dsn.jdwl.index');
    Route::get('/class/{kode_kelas}/absen', 'absenMhs')->name('absenMhs')->middleware('permission:dsn.jdwl.index');
    Route::post('/updateAbsensi', 'updateAbsensi')->name('updateAbsensi')->middleware('permission:dsn.jdwl.index');
    // Route::post('/', 'store')->name('store')->middleware('permission:dsn.tgs.create');
});