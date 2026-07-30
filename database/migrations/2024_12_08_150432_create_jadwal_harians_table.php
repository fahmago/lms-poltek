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
        Schema::create('jadwal_harians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_harian_id')->constrained('kelas_harians')->onDelete('cascade');
            $table->string('kode_kelas_harian', 10)->nullable(); // Kode Kelas Harian
            $table->string('uuid'); 
            $table->string('kode_unik')->nullable(); // Kode Unik
            $table->string('tanggal')->nullable();  // Tanggal
            $table->string('tahun')->nullable(); // Tahun
            $table->string('waktu_isi_absen')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_harians');
    }
};
