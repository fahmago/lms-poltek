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
        Schema::create('pengumpulan_tugas_harians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tugas_harian_id')->constrained()->cascadeOnDelete();
            $table->string('kode_kelas_harian', 10)->nullable(); 
            $table->foreignId('mahasiswa_id')->constrained()->cascadeOnDelete();
            $table->string('uuid'); 
            $table->string('link_tugas');
            $table->text('kendala')->nullable(); 
            $table->decimal('nilai', 5, 2)->nullable(); 
            $table->string('tanggal_dikirim')->nullable(); 
            $table->string('status')->nullable();
            $table->string('feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumpulan_tugas_harians');
    }
};
