<?php

use App\Http\Controllers\My\Dosen\Harian\JadwalHarianDosenController;
use App\Http\Controllers\My\Dosen\Harian\KelasHarianDosenController;
use App\Http\Controllers\My\Dosen\Harian\MateriHarianDosenController;
use App\Http\Controllers\My\Dosen\Harian\TugasHarianDosenController;
use App\Http\Controllers\My\Dosen\JadwalDosenController;
use App\Http\Controllers\My\Dosen\KelasDosenController;
use App\Http\Controllers\My\Dosen\MateriDosenController;
use App\Http\Controllers\My\Dosen\Pekanan\TugasPekananController;
use App\Http\Controllers\My\Dosen\SKL\BukuController;
use App\Http\Controllers\My\Dosen\SKL\PortofolioController;
use App\Http\Controllers\My\Dosen\SKL\ProjectSemesterController;
use App\Http\Controllers\My\Dosen\SKL\SertifikatController;
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


Route::controller(KelasHarianDosenController::class)->prefix('d/harian/kelas_harian')->name('dsn.dh.kelas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.dh.kelas.index');
    Route::put('/update/{uuid}/enroll', 'updateEnroll')->name('updateEnroll')->middleware('permission:dsn.dh.kelas.enroll');
    Route::put('/{uuid}', 'updateJamDur')->name('updateJamDur')->middleware('permission:dsn.dh.kelas.edit');
    Route::get('/{uuid}/mhsList', 'show')->name('show')->middleware('permission:dsn.dh.kelas.show');
    Route::get('/{uuid}/viewMhs', 'viewMhs')->name('viewMhs')->middleware('permission:dsn.dh.kelas.view');
});

Route::controller(JadwalHarianDosenController::class)->prefix('d/harian/jadwal_harian')->name('dsn.dh.jadwal.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.dh.jadwal.index');
    Route::get('/{kode_kelas_harian}/showJadwal', 'showJadwal')->name('showJadwal')->middleware('permission:dsn.dh.jadwal.showJadwal');
    Route::get('/{kode_kelas_harian}/{month}/listJadwal', 'listJadwal')->name('listJadwal');
    Route::put('/{uuid}', 'update')->name('updateJadwal');
    Route::get('/class/{uuid_kelas_harian}/{month}/absen', 'absenMhs')->name('absenMhs');
    Route::post('/updateAbsensi', 'updateAbsensi')->name('updateAbsensi');
    Route::post('/set-hadir-semua', 'setHadirSemua')->name('setHadirSemua')->middleware('permission:dsn.dh.jadwal.setHadirSemua');
});

Route::controller(TugasHarianDosenController::class)->prefix('d/harian/tugas_harian')->name('dsn.dh.tugas.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.dh.tugas.index');
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:dsn.dh.tugas.show');
    Route::get('/create', 'create')->name('create')->middleware('permission:dsn.dh.tugas.create');
    Route::post('/', 'store')->name('store')->middleware('permission:dsn.dh.tugas.create');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dsn.dh.tugas.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:dsn.dh.tugas.delete');
    Route::get('{uuid}/respon', 'responTugas')->name('responTugas')->middleware('permission:dsn.dh.tugas.index');
    Route::post('{uuid}/feedBack', 'feedBackTugas')->name('feedBackTugas')->middleware('permission:dsn.dh.tugas.index');
    Route::delete('/respon/delete/{uuid}', 'deleteRespon')->name('deleteRespon')->middleware('permission:dsn.dh.tugas.index');
});

Route::controller(MateriHarianDosenController::class)->prefix('d/harian/materi_harian')->name('dsn.dh.materi.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.dh.mtr.index');
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:dsn.dh.mtr.show');
    Route::get('/create', 'create')->name('create')->middleware('permission:dsn.dh.mtr.create');
    Route::post('/', 'store')->name('store')->middleware('permission:dsn.dh.mtr.create');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:dsn.dh.mtr.edit');
    Route::delete('/{uuid}', 'destroy')->name('destroy')->middleware('permission:dsn.dh.mtr.delete');
});

Route::controller(TugasPekananController::class)->prefix('d/tugas-pekanan')->name('dsn.tweek.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.pekanan.index');
    Route::get('/{kelasHarian:uuid}', 'show')->name('show')->middleware('permission:dsn.pekanan.show');
    Route::get('/{kelasHarian:uuid}/task/{tugasPekanan:uuid}', 'detail')->name('detail')->middleware('permission:dsn.pekanan.show');
    Route::put('/submission/{pengumpulanTugasPekanan:uuid}/grade', 'submitGrade')->name('submit_grade')->middleware('permission:dsn.pekanan.show');
});

Route::controller(ProjectSemesterController::class)->prefix('d/project-semester')->name('dsn.tsem.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.project.semester.index');
    Route::get('/{kelasHarian:uuid}', 'show')->name('show')->middleware('permission:dsn.project.semester.show');
    Route::get('/{kelasHarian:uuid}/task/{projectSemester:uuid}', 'detail')->name('detail')->middleware('permission:dsn.project.semester.show');
    Route::put('/submission/{pengumpulanProjectSemester:uuid}/grade', 'submitGrade')->name('submit_grade')->middleware('permission:dsn.project.semester.show');
});

Route::controller(PortofolioController::class)->prefix('d/portofolio')->name('dsn.portofolio.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.portofolio.index');
    Route::get('/{kelasHarian:uuid}', 'show')->name('show')->middleware('permission:dsn.portofolio.show');
    Route::get('/{kelasHarian:uuid}/task/{portofolio:uuid}', 'detail')->name('detail')->middleware('permission:dsn.portofolio.show');
    Route::put('/submission/{pengumpulanPortofolio:uuid}/grade', 'submitGrade')->name('submit_grade')->middleware('permission:dsn.portofolio.show');
});

Route::controller(BukuController::class)->prefix('d/buku')->name('dsn.buku.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.buku.index');
    Route::get('/{kelasHarian:uuid}', 'show')->name('show')->middleware('permission:dsn.buku.show');
    Route::get('/{kelasHarian:uuid}/task/{buku:uuid}', 'detail')->name('detail')->middleware('permission:dsn.buku.show');
    Route::put('/submission/{pengumpulanBuku:uuid}/grade', 'submitGrade')->name('submit_grade')->middleware('permission:dsn.buku.show');
});

Route::controller(SertifikatController::class)->prefix('d/sertifikat')->name('dsn.sertifikat.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:dsn.sertifikat.index');
    Route::get('/{kelasHarian:uuid}', 'show')->name('show')->middleware('permission:dsn.sertifikat.show');
    Route::get('/{kelasHarian:uuid}/task/{sertifikat:uuid}', 'detail')->name('detail')->middleware('permission:dsn.sertifikat.show');
    Route::put('/submission/{pengumpulanSertifikat:uuid}/grade', 'submitGrade')->name('submit_grade')->middleware('permission:dsn.sertifikat.show');
});