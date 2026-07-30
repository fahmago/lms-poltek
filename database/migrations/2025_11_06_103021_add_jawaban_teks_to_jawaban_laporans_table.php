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
        Schema::table('jawaban_laporans', function (Blueprint $table) {
            $table->foreignId('pilihan_jawaban_id')->nullable()->change();
            $table->text('jawaban_teks')->nullable()->after('pilihan_jawaban_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jawaban_laporans', function (Blueprint $table) {
            // 1. Hapus kolom jawaban teks
            $table->dropColumn('jawaban_teks');

            // 2. Kembalikan kolom foreign key jadi NOT NULL
            $table->foreignId('pilihan_jawaban_id')->nullable(false)->change();
        });
    }
};
