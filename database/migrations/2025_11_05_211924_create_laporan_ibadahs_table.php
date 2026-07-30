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
        Schema::create('laporan_ibadahs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            // Relasi ke mahasiswa yang mengisi
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');
            $table->date('tanggal_laporan'); // Laporan absensi untuk tanggal berapa
            // Total poin akan dihitung dan disimpan di sini saat submit
            $table->integer('total_poin')->nullable();    
            // Mahasiswa hanya bisa submit 1 laporan per hari
            $table->unique(['mahasiswa_id', 'tanggal_laporan']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_ibadahs');
    }
};
