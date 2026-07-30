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
        Schema::create('pertanyaans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->text('teks_pertanyaan'); // Misal: "1. Apakah anda Sholat Tahajud ?"
            $table->string('tipe_pertanyaan')->default('pilihan_ganda'); // Bisa 'pilihan_ganda', 'checkbox', 'teks'
            $table->boolean('wajib_diisi')->default(true);
            $table->integer('urutan')->default(0); // Untuk mengurutkan tampilan pertanyaan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pertanyaans');
    }
};
