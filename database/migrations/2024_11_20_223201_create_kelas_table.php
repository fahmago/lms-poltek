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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('matkul_id')->constrained('matkuls')->onDelete('cascade');
            $table->foreignId('dosen_id')->constrained('dosens')->onDelete('cascade');
            $table->string('nidn', 20)->nullable(); 
            $table->string('kode_matkul', 10);
            $table->string('uuid');
            $table->string('kode_kelas', 10);
            $table->string('nama_kelas');
            $table->string('tahun')->nullable();            
            // $table->string('ruangan')->nullable();            
            $table->string('kode_enroll')->nullable();            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
