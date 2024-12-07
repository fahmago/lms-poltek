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
        Schema::create('dosens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('kode_prodi', 10); 
            $table->string('uuid');
            $table->string('nidn', 20)->nullable(); 
            $table->string('tempat_lahir', 100)->nullable(); 
            $table->date('tanggal_lahir')->nullable(); 
            $table->string('telepon')->nullable(); 
            $table->enum('gender', ['L', 'P'])->nullable(); 
            $table->string('image')->nullable();
            $table->boolean('is_lengkap')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosens');
    }
};
