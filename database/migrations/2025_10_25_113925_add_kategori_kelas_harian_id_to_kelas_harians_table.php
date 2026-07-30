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
        Schema::table('kelas_harians', function (Blueprint $table) {
            $table->foreignId('kategori_kelas_harian_id')
                ->nullable()
                ->constrained('kategori_kelas_harians')
                ->onDelete('set null')
                ->after('dosen_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kelas_harians', function (Blueprint $table) {
            $table->dropForeign(['kategori_kelas_harian_id']);
            $table->dropColumn('kategori_kelas_harian_id');
        });
    }
};
