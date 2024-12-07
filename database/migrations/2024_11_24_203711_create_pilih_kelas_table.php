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
        Schema::create('pilih_kelas', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->foreignId('mahasiswa_id')->constrained()->cascadeOnDelete();
            $table->string('kode_kelas', 10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pilih_kelas');
    }
};
