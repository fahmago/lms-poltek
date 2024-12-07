<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained()->cascadeOnDelete(); // FK1: Relasi ke tabel `mahasiswas`
            $table->foreignId('jadwal_id')->constrained()->cascadeOnDelete();    // FK2: Relasi ke tabel `jadwals`
            $table->string('kode_kelas', 10);                                    // FK3: Relasi ke tabel `kelas`
            $table->string('uuid');                                                // Unique identifier
            $table->string('waktu_absensi');                                           // Tanggal absensi
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha'])->default('alpha'); // Status absensi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};
