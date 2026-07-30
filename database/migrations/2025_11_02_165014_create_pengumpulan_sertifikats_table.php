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
        Schema::create('pengumpulan_sertifikats', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            // Relasi ke penugasan sertifikat dan mahasiswa yang mengumpulkan
            $table->foreignId('sertifikat_id')->constrained('sertifikats')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');

            // (Sebelumnya path_file_sertifikat)
            // Link ke file sertifikat: GDrive PDF, JPG, dll
            $table->text('link_file_sertifikat')->nullable(); 

            // Link untuk validasi sertifikat secara online
            $table->text('link_verifikasi')->nullable(); 
            
            // Nama lembaga penerbit sertifikat
            $table->string('nama_penerbit')->nullable();

            // Tanggal sertifikat diterbitkan
            $table->date('tanggal_terbit')->nullable();

            // Kolom untuk penilaian
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
        Schema::dropIfExists('pengumpulan_sertifikats');
    }
};
