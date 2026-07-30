<?php

use App\Http\Controllers\My\Admin\AngkatanController;
use App\Http\Controllers\My\Admin\DosenController;
use App\Http\Controllers\My\Admin\Harian\JadwalHarianController;
use App\Http\Controllers\My\Admin\Harian\KategoriKelasHarianController;
use App\Http\Controllers\My\Admin\Harian\KehadiranStatusController;
use App\Http\Controllers\My\Admin\Harian\KelasHarianController;
use App\Http\Controllers\My\Admin\JadwalController;
use App\Http\Controllers\My\Admin\KelasController;
use App\Http\Controllers\My\Admin\MahasiswaController;
use App\Http\Controllers\My\Admin\MatkulController;
use App\Http\Controllers\My\Admin\ProdiController;
use Illuminate\Support\Facades\Route;

Route::controller(AngkatanController::class)->prefix('angkatan')->name('my.angkatans.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:angkatans.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:angkatans.create');
    Route::post('/', 'store')->name('store')->middleware('permission:angkatans.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:angkatans.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:angkatans.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:angkatans.delete');
});

Route::controller(ProdiController::class)->prefix('prodi')->name('my.prodis.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:prodis.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:prodis.create');
    Route::post('/', 'store')->name('store')->middleware('permission:prodis.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:prodis.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:prodis.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:prodis.delete');
});

Route::controller(MahasiswaController::class)->prefix('mahasiswa')->name('my.mahasiswas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:mahasiswas.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:mahasiswas.create');
    Route::post('/', 'store')->name('store')->middleware('permission:mahasiswas.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:mahasiswas.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:mahasiswas.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:mahasiswas.delete');
    Route::delete('/kelas-harian/{kelas_harian_uuid}', 'leaveClass')->name('leave_class')->middleware('permission:mahasiswas.delete');
});

Route::controller(DosenController::class)->prefix('dosen')->name('my.dosens.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dosens.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:dosens.create');
    Route::post('/', 'store')->name('store')->middleware('permission:dosens.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:dosens.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dosens.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:dosens.delete');
});

Route::controller(MatkulController::class)->prefix('matkul')->name('my.matkuls.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:matkuls.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:matkuls.create');
    Route::post('/', 'store')->name('store')->middleware('permission:matkuls.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:matkuls.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:matkuls.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:matkuls.delete');

    Route::get('/matkul-excel', 'showImportMatkulsForm')->name('matkul.excel')->middleware('permission:matkuls.excel');
    Route::post('/matkul-excel', 'importExcelMatkul')->name('matkul.excel.post')->middleware('permission:matkuls.excel');
});

Route::controller(KelasController::class)->prefix('kelas')->name('my.kelas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:kelas.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:kelas.create');
    Route::get('/class/{kode_kelas}/cetak_absensi', 'printAbsensiKelas')->name('printAbsensiKelas');
    Route::post('/', 'store')->name('store')->middleware('permission:kelas.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:kelas.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:kelas.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:kelas.delete');
});

Route::controller(JadwalController::class)->prefix('jadwal')->name('my.jadwal.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:jadwal.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:jadwal.create');
    Route::post('/', 'store')->name('store')->middleware('permission:jadwal.create');
});

Route::controller(KategoriKelasHarianController::class)->prefix('kategori-kelas-harian')->name('my.kategori_kelas_harians.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:kategori.kelasharian.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:kategori.kelasharian.create');
    Route::post('/', 'store')->name('store')->middleware('permission:kategori.kelasharian.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:kategori.kelasharian.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:kategori.kelasharian.edit');
    Route::put('/{uuid}/toggle-it', 'toggleItStatus')->name('toggle_it')->middleware('permission:kategori.kelasharian.edit');
    Route::put('/{uuid}/update-jenis', 'updateJenis')->name('update_jenis')->middleware('permission:kategori.kelasharian.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:kategori.kelasharian.delete');
});

Route::controller(KelasHarianController::class)->prefix('harian/kelas_harian')->name('my.dh.kelas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dh.kelas.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:dh.kelas.create');
    Route::get('/class/{uuid}/{month}/cetak_absensi_harian', 'printAbsensiKelas')->name('printAbsensiKelas')->middleware('permission:dh.kelas.print');
    Route::get('/class/{uuid}/{month}/export_absensi_harian', 'exportAbsensiKelas')->name('exportAbsensiKelas');
    Route::post('/', 'store')->name('store')->middleware('permission:dh.kelas.create');
    Route::get('/{uuid}/edit', 'edit')->name('edit')->middleware('permission:dh.kelas.edit');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dh.kelas.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:dh.kelas.delete');
});

Route::controller(JadwalHarianController::class)->prefix('harian/jadwal_harian')->name('my.dh.jadwal.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dh.jadwal.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:dh.jadwal.create');
    Route::post('/', 'store')->name('store')->middleware('permission:dh.jadwal.create');
    Route::post('/repair-uuid-kodeunik', 'repairUuidAndKodeUnik')->name('repairUuidAndKodeUnik')->middleware('permission:dh.jadwal.create');
});

Route::controller(KehadiranStatusController::class)->prefix('harian')->name('my.kehadiran.status.')->group(function () {
    Route::get('/status/kehadiran/mahasiswa', 'index')->name('index')->middleware('permission:kehadiran.status.index');
});

require __DIR__ . '/sub_route_lainnya/tugas_pekanan.php';
require __DIR__ . '/sub_route_lainnya/skl.php';
require __DIR__ . '/sub_route_lainnya/ibadah.php';
