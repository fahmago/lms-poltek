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
        Schema::create('materi_harians', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('kelas_id')->constrained()->onDelete('cascade');
            $table->foreignId('dosen_id')->constrained('dosens')->onDelete('cascade');
            $table->string('nidn', 20)->nullable(); 
            $table->string('kode_kelas_harian', 10)->nullable();
            $table->string('uuid');
            $table->string('judul');
            $table->text('deskripsi');
            $table->string('file')->nullable();
            $table->string('tanggal_dibuat')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materi_harians');
    }
};
