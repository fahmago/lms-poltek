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
        Schema::create('pilihan_jawabans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('pertanyaan_id')->constrained('pertanyaans')->onDelete('cascade');            
            $table->string('teks_jawaban'); // Misal: "Ya", "Tidak", "Haid", "Tidak ke Masjid"
            $table->integer('poin')->default(0); // Poin untuk jawaban ini            
            // Ini untuk menangani kasus 'Haid'
            $table->enum('khusus_gender', ['L', 'P'])->nullable()
                  ->comment('Tampilkan pilihan ini hanya untuk L/P. NULL berarti tampilkan untuk semua.');            
            $table->integer('urutan')->default(0); // Mengurutkan pilihan jawaban

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pilihan_jawabans');
    }
};
