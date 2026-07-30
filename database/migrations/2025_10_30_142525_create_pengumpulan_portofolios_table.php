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
        Schema::create('pengumpulan_portofolios', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            // Relasi ke penugasan portofolio dan mahasiswa yang mengumpulkan
            $table->foreignId('portofolio_id')->constrained('portofolios')->onDelete('cascade');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswas')->onDelete('cascade');

            // Kolom untuk jawaban/pengumpulan
            $table->string('link_repository')->nullable(); // Link GitHub/GitLab
            $table->text('link_demo')->nullable();       // Link aplikasi (jika ada)

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
        Schema::dropIfExists('pengumpulan_portofolios');
    }
};
