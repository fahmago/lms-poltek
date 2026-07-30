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
        Schema::create('pengumpulan_project_semesters', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            // Relasi ke project dan mahasiswa
            $table->foreignId('project_semester_id')->constrained('project_semesters')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');

            // Kolom untuk jawaban/pengumpulan
            $table->string('link_repository')->nullable(); // Contoh: Link GitHub/GitLab
            $table->string('link_demo')->nullable();       // Contoh: Link aplikasi yang sudah di-deploy
            $table->string('path_file_laporan')->nullable(); // Path ke file laporan jika ada (di storage)
            
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
        Schema::dropIfExists('pengumpulan_project_semesters');
    }
};
