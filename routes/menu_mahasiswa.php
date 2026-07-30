<?php

use App\Http\Controllers\My\Mahasiswa\AbsensiMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\Harian\AbsensiHarianMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\Harian\KelasHarianMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\KelasMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\MateriMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\NimMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\ProfilMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\RegistrasiKelasController;
use App\Http\Controllers\My\Mahasiswa\Harian\TugasHarianMahasiswaController;
use App\Http\Controllers\My\Mahasiswa\Ibadah\LaporanIbadahController;
use App\Http\Controllers\My\Mahasiswa\Pekanan\TugasPekananController;
use App\Http\Controllers\My\Mahasiswa\SKL\BukuController;
use App\Http\Controllers\My\Mahasiswa\SKL\PortofolioController;
use App\Http\Controllers\My\Mahasiswa\SKL\ProjectSemesterController;
use App\Http\Controllers\My\Mahasiswa\SKL\SertifikatController;
use App\Http\Controllers\My\Mahasiswa\TugasMahasiswaController;
use Illuminate\Support\Facades\Route;

Route::controller(ProfilMahasiswaController::class)->prefix('mhs/profil')->name('mhs.profil.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:mhs.pro.index');
    Route::put('/{uuid}', 'update')->name('update')->middleware('permission:mhs.pro.index');
});

Route::middleware(['mhs_profile_complete', 'cek_laporan_ibadah_wajib'])->group(function () {

    Route::controller(NimMahasiswaController::class)->prefix('mhs/nim')->name('mhs.nim.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.nim.index');
        Route::post('/', 'store')->name('store')->middleware('permission:mhs.nim.index');
    });

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

    Route::controller(RegistrasiKelasController::class)->prefix('mhs/join')->name('mhs.join.')->group(function () {
        Route::get('/kelas-harian', 'joinClass')->name('index')->middleware('permission:mhs.join.index');
        Route::post('/join-daily-class', 'joinStore')->name('store')->middleware('permission:mhs.join.index');
    });

    Route::controller(KelasHarianMahasiswaController::class)->prefix('mhs/harian/kelas_harian')->name('mhs.dh.kls.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.dh.kelas.index');
    });

    Route::controller(AbsensiHarianMahasiswaController::class)->prefix('mhs/harian/absensi_harian')->name('mhs.dh.abs.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.dh.abs.index');
        Route::get('/{kode_kelas_harian}/showJadwal', 'showJadwal')->name('showJadwal')->middleware('permission:mhs.dh.abs.jadwal');
        Route::get('/{kode_kelas_harian}/{month}/listJadwal', 'listJadwal')->name('listJadwal');
        Route::post('/doPresence', 'doPresence')->name('doPresence');
    });

    Route::controller(TugasHarianMahasiswaController::class)->prefix('mhs/harian/tugas_harian')->name('mhs.dh.tgs.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.dh.tgs.index');
        Route::get('/class/{kode_kelas_harian}/tugas', 'showTugas')->name('showTugas')->middleware('permission:mhs.dh.tgs.show');
        Route::post('/sendTugas', 'sendTugas')->name('sendTugas')->middleware('permission:mhs.dh.tgs.show');
    });

    Route::controller(TugasPekananController::class)->prefix('mhs/pekanan/tugas-pekanan')->name('mhs.tweek.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.pekanan.index');
        Route::get('/{tugasPekanan:uuid}', 'show')->name('show')->middleware('permission:mhs.pekanan.index');
        Route::post('/{tugasPekanan:uuid}/submit', 'submit')->name('submit')->middleware('permission:mhs.pekanan.index');
    });

    Route::controller(ProjectSemesterController::class)->prefix('mhs/project-semester')->name('mhs.tsem.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.project.semester.index');
        Route::get('/{projectSemester:uuid}', 'show')->name('show')->middleware('permission:mhs.project.semester.index');
        Route::post('/{projectSemester:uuid}/submit', 'submit')->name('submit')->middleware('permission:mhs.project.semester.index');
    });

    Route::controller(PortofolioController::class)->prefix('mhs/portofolio')->name('mhs.portofolio.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.portofolio.index');
        Route::get('/{portofolio:uuid}', 'show')->name('show')->middleware('permission:mhs.portofolio.index');
        Route::post('/{portofolio:uuid}/submit', 'submit')->name('submit')->middleware('permission:mhs.portofolio.index');
    });

    Route::controller(BukuController::class)->prefix('mhs/buku')->name('mhs.buku.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.buku.index');
        Route::get('/{buku:uuid}', 'show')->name('show')->middleware('permission:mhs.buku.index');
        Route::post('/{buku:uuid}/submit', 'submit')->name('submit')->middleware('permission:mhs.buku.index');
    });

    Route::controller(SertifikatController::class)->prefix('mhs/sertifikat')->name('mhs.sertifikat.')->group(function () {
        Route::get('/', 'index')->name('index')->middleware('permission:mhs.sertifikat.index');
        Route::get('/{sertifikat:uuid}', 'show')->name('show')->middleware('permission:mhs.sertifikat.index');
        Route::post('/{sertifikat:uuid}/submit', 'submit')->name('submit')->middleware('permission:mhs.sertifikat.index');
    });

    Route::controller(LaporanIbadahController::class)
        ->prefix('mhs/laporan-ibadah-harian')
        ->name('mhs.laporan-ibadah.')
        ->group(function () {
            Route::get('/', 'index')->name('index')->middleware('permission:mhs.dh.sholat.index'); // Opsional
            Route::get('/new', 'create')->name('create')->middleware('permission:mhs.dh.sholat.index'); // Opsional
            Route::post('/', 'store')->name('store')->middleware('permission:mhs.dh.sholat.index'); // Opsional
        });
});
