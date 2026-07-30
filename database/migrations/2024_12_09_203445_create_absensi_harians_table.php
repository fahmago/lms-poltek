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
        Schema::create('absensi_harians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained()->cascadeOnDelete(); 
            $table->foreignId('jadwal_harian_id')->constrained()->cascadeOnDelete();   
            $table->foreignId('kelas_harian_id')->constrained()->cascadeOnDelete();   
            $table->string('kode_kelas_harian', 10);                                   
            $table->string('uuid');                                  
            $table->string('waktu_absensi');                                       
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha'])->default('alpha'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi_harians');
    }
};
