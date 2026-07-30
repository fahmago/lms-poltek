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
        Schema::create('project_semesters', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('prodi_id')->constrained('prodis')->onDelete('cascade');
            $table->string('judul');
            $table->longText('deskripsi')->nullable();
            $table->text('catatan')->nullable(); // Mungkin ada catatan khusus untuk proyek
            $table->dateTime('waktu_mulai');
            $table->dateTime('batas_waktu');
            $table->timestamps();
        });

        Schema::create('kelas_harian_project_semester', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_semester_id')->constrained('project_semesters')->onDelete('cascade');
            $table->foreignId('kelas_harian_id')->constrained('kelas_harians')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas_harian_project_semester');
        Schema::dropIfExists('project_semesters');
    }
};
