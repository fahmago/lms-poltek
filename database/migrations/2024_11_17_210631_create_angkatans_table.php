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
        Schema::create('angkatans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid'); 
            $table->string('kode_tahun')->unique();
            $table->string('nama_angkatan');
            $table->string('ketua_angkatan');
            $table->string('tahun_angkatan');
            $table->timestamps();
            // $table->unique(['uuid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('angkatans');
    }
};
