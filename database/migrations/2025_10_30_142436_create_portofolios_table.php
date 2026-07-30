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
        Schema::create('portofolios', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            
            // Relasi ke prodi, sama seperti project_semester
            $table->foreignId('prodi_id')->constrained('prodis')->onDelete('cascade');
            
            $table->string('judul'); // Judul penugasan portofolio
            $table->longText('deskripsi')->nullable();
            
            // Waktu mulai dan batas waktu pengumpulan
            $table->dateTime('waktu_mulai');
            $table->dateTime('batas_waktu');
            
            $table->timestamps();
        });

        // Tabel pivot untuk relasi Many-to-Many antara Portofolio dan Kelas Harian
        Schema::create('kelas_harian_portofolio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portofolio_id')->constrained('portofolios')->onDelete('cascade');
            $table->foreignId('kelas_harian_id')->constrained('kelas_harians')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas_harian_portofolio');
        Schema::dropIfExists('portofolios');
    }
};
