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
        Schema::table('pertanyaans', function (Blueprint $table) {
            $table->enum('kategori', ['umum', 'haid'])
                  ->default('umum')
                  ->after('urutan')
                  ->comment('Kategori pertanyaan, misal umum (sholat) atau haid (dzikir).');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pertanyaans', function (Blueprint $table) {
            $table->dropColumn('kategori');
        });
    }
};
