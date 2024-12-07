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
        Schema::create('tugas', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade'); // Foreign Key
            $table->string('kode_kelas', 10);
            $table->string('uuid');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('tanggal_deadline');
            $table->string('tanggal_diberikan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tugas');
    }
};
