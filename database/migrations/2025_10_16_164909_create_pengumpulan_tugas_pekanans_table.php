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
        Schema::create('pengumpulan_tugas_pekanans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            $table->foreignId('tugas_pekanan_id')->constrained('tugas_pekanans')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');

            // Kolom jawaban akan menyimpan data dalam format JSON.
            // - Untuk tipe 'other': "https://link.com/artikel"
            // - Untuk tipe 'yt' (video tunggal): ["videoId"]
            // - Untuk tipe 'yt' (playlist): ["videoId1", "videoId2", ...]
            $table->longText('jawaban');
            
            $table->string('status')->default('diserahkan'); // Status: diserahkan, terlambat, dinilai
            $table->unsignedInteger('nilai')->nullable();
            $table->text('feedback_dosen')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumpulan_tugas_pekanans');
    }
};
