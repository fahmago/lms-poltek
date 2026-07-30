<?php

use App\Http\Controllers\My\DashboardController;
use App\Http\Controllers\My\DetailSklMahasiswaController;
use App\Http\Controllers\My\GrafikController;
use App\Http\Controllers\My\GrafikIbadahController;
use App\Http\Controllers\My\GrafikKelasHarianController;
use App\Http\Controllers\My\GrafikSklController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', DashboardController::class)->middleware('mhs_profile_complete')->name('my.dashboard.index');

Route::controller(GrafikController::class)->prefix('grafik')->name('my.grafik.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:sidebar.grafik');
    Route::get('/attendance-data', 'getAttendanceData')->name('attendance_data')->middleware('permission:sidebar.grafik');
});

Route::controller(GrafikKelasHarianController::class)->prefix('statistik/kelas-harian')->name('my.grafik.kelas_harian.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:sidebar.grafik.kelas_harian');
    Route::get('/attendance-data', 'getAttendanceData')->name('attendance_data')->middleware('permission:sidebar.grafik.kelas_harian');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:sidebar.grafik.kelas_harian');
});

Route::controller(GrafikSklController::class)->prefix('chart/skl')->name('my.grafik.skl.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:sidebar.grafik.skl');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:sidebar.grafik.skl');
    Route::get('/skl-data', 'getSklData')->name('skl_data')->middleware('permission:sidebar.grafik.skl');
    Route::get('/skl-data/print', 'printSklData')->name('skl_data.print')->middleware('permission:sidebar.grafik.skl');
});

Route::controller(DetailSklMahasiswaController::class)->prefix('skl')->name('my.detail.skl.')->group(function () {
    Route::get('/mahasiswa/{mahasiswaUuid}/{kelasUuid}', 'detailMahasiswa')
        ->name('detail_mahasiswa')
        ->middleware('permission:sidebar.grafik.skl');
});

Route::controller(GrafikIbadahController::class)->prefix('statistik/laporan-ibadah')->name('my.grafik.laporan_ibadah.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:sidebar.grafik.ibadah');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:sidebar.grafik.ibadah');
    Route::get('/ibadah-score-data', 'getIbadahScoreData')->name('ibadah_score_data')->middleware('permission:sidebar.grafik.ibadah');
    Route::get('/laporan-ibadah-detail/{uuid}', 'showLaporanDetail')->name('show_detail')->middleware('permission:sidebar.grafik.ibadah');
    Route::get('/student_detail_data/{mahasiswaUuid}/start_date/{startDate}/end_date/{endDate}/{kelasUuid?}', 'getStudentDetailData')->name('student_detail_data')->middleware('permission:sidebar.grafik.ibadah');
});
