<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueVideoIdForTask implements ValidationRule
{
    private $tugasPekananId;
    private $currentMahasiswaId;
    private $prodiId;

    /**
     * Buat instance rule baru.
     *
     * @param int $tugasPekananId ID tugas yang sedang divalidasi.
     * @param int $currentMahasiswaId ID mahasiswa yang sedang submit.
     * @param int $prodiId ID prodi dari tugas tersebut.
     */
    public function __construct($tugasPekananId, $currentMahasiswaId, $prodiId)
    {
        $this->tugasPekananId = $tugasPekananId;
        $this->currentMahasiswaId = $currentMahasiswaId;
        $this->prodiId = $prodiId;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $videoId = $value;

        // Query untuk mengecek apakah Video ID ini sudah ada di jawaban mahasiswa manapun
        // di SEMUA tugas dalam prodi yang sama.
        $exists = DB::table('pengumpulan_tugas_pekanans')
            ->join('tugas_pekanans', 'pengumpulan_tugas_pekanans.tugas_pekanan_id', '=', 'tugas_pekanans.id')
            // Filter hanya untuk tugas dalam prodi yang sama
            ->where('tugas_pekanans.prodi_id', $this->prodiId)
            // Cari video ID di dalam kolom JSON
            ->whereJsonContains('pengumpulan_tugas_pekanans.jawaban', $videoId)
            // KECUALIKAN record yang sedang diedit (jika ada).
            // Jika record yang ditemukan adalah milik mahasiswa ini DAN untuk tugas ini, maka itu bukan duplikat.
            ->whereNot(function ($query) {
                $query->where('pengumpulan_tugas_pekanans.tugas_pekanan_id', $this->tugasPekananId)
                      ->where('pengumpulan_tugas_pekanans.mahasiswa_id', $this->currentMahasiswaId);
            })
            ->exists();

        if ($exists) {
            $fail("Video ID '{$videoId}' sudah pernah digunakan pada tugas lain di prodi ini.");
        }
    }
}
