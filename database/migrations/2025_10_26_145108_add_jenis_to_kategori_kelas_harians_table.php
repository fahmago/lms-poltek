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
        Schema::table('kategori_kelas_harians', function (Blueprint $table) {
            $table->enum('jenis', ['IT', 'ENGLISH', 'AGAMA'])
                  ->nullable()
                  ->default(null)
                  ->after('nama_kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kategori_kelas_harians', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};
