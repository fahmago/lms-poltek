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
        Schema::create('jawaban_laporans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            // Relasi ke laporan induk
            $table->foreignId('laporan_ibadah_id')->constrained('laporan_ibadahs')->onDelete('cascade');
            // Relasi ke pertanyaan yang dijawab
            $table->foreignId('pertanyaan_id')->constrained('pertanyaans')->onDelete('cascade');
            // Relasi ke pilihan jawaban yang dipilih
            $table->foreignId('pilihan_jawaban_id')->constrained('pilihan_jawabans')->onDelete('cascade');
            // Menyimpan poin saat itu juga (best practice)
            // Jadi jika poin di tabel 'pilihan_jawabans' diubah,
            // laporan lama tidak akan terpengaruh.
            $table->integer('poin_didapat')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_laporans');
    }
};
