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
        Schema::create('tugas_pekanans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('prodi_id')->constrained('prodis')->onDelete('cascade');
            $table->string('judul');
            $table->longText('deskripsi')->nullable();
            $table->enum('tipe_tugas', ['yt', 'other'])->default('yt'); // Diubah menjadi ENUM
            $table->dateTime('waktu_mulai');
            $table->dateTime('batas_waktu');
            $table->timestamps();
        });

        // Tabel perantara (pivot table) untuk relasi many-to-many
        Schema::create('kelas_harian_tugas_pekanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tugas_pekanan_id')->constrained('tugas_pekanans')->onDelete('cascade');
            $table->foreignId('kelas_harian_id')->constrained('kelas_harians')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas_harian_tugas_pekanan');
        Schema::dropIfExists('tugas_pekanans');
    }
};
