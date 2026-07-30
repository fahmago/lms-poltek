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
        Schema::create('pengumpulan_bukus', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            // Relasi ke penugasan buku dan mahasiswa yang mengumpulkan
            $table->foreignId('buku_id')->constrained('bukus')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');

            // --- Kolom Saran untuk Pengumpulan Buku ---
            
            // (Mirip 'link_repository')
            // Link ke source/draft: Google Docs, Canva, Overleaf, GitHub Repo
            $table->text('link_naskah_draft')->nullable(); 

            // (Mirip 'link_demo')
            // Link ke hasil final: PDF di GDrive, GitBook, Flipbook
            $table->text('link_hasil_buku')->nullable(); 

            // ---------------------------------------------

            // Kolom untuk penilaian (sama persis)
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
        Schema::dropIfExists('pengumpulan_bukus');
    }
};
