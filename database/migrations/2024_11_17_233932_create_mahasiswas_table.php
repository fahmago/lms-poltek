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
        Schema::create('mahasiswas', function (Blueprint $table) {
            $table->id();

            // $table->foreignId('user_id')->references('id')->on('users')->nullOnDelete();
            // $table->foreignId('kode_tahun')->references('kode_tahun')->on('angkatans')->nullOnDelete();
            // $table->foreignId('kode_prodi')->references('kode_prodi')->on('prodis')->nullOnDelete();

            // $table->foreignId('user_id')->constrained()->cascadeOnDelete(); 
            // $table->foreignId('kode_tahun')->constrained('angkatans', 'kode_tahun')->nullOnDelete(); 
            // $table->foreignId('kode_prodi')->constrained('prodis', 'kode_prodi')->nullOnDelete(); 

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('kode_tahun');
            $table->string('kode_prodi', 10);
            
            $table->uuid('uuid');
            $table->string('nim')->unique()->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->string('tanggal_lahir')->nullable(); 
            $table->string('telepon')->nullable(); 
            $table->enum('gender', ['L', 'P'])->nullable();
            $table->text('alasan_pilih_idn')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_lengkap')->default(false);
            $table->timestamps();
            // $table->unique(['uuid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswas');
    }
};
