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
        Schema::create('kelas_harians', function (Blueprint $table) {
            $table->id();            
            $table->foreignId('dosen_id')->constrained('dosens')->onDelete('cascade');
            $table->string('uuid');
            $table->string('kode_kelas_harian', 10);
            $table->string('nama_kelas');
            $table->time('jam_mulai');
            $table->integer('durasi')->comment('Durasi dalam menit');
            $table->string('tahun')->nullable();                 
            $table->integer('semester')->nullable();                
            $table->string('kode_enroll')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas_harians');
    }
};
