<?php

namespace App\Helpers;

use App\Models\Ibadah\Pertanyaan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IbadahHelper
{
    /**
     * Hitung statistik ibadah mahasiswa berdasarkan rentang tanggal.
     */
    public static function hitungStatistikIbadah($mahasiswaId, $gender, $startDateParam = null, $endDateParam = null)
    {
        // 1. Cari laporan pertama mahasiswa
        $firstReport = DB::table('laporan_ibadahs')
            ->where('mahasiswa_id', $mahasiswaId)
            ->min('tanggal_laporan');

        // Jika tidak ada laporan = return kosong
        if (!$firstReport) {
            return [
                'periode' => '-',
                'total_hari' => 0,
                'total_haid' => 0,
                'target_poin' => 0,
                'capaian_poin' => 0,
                'persentase' => 0
            ];
        }

        // 2. Tentukan startDate
        $startDate = $startDateParam
            ? Carbon::parse($startDateParam)->startOfDay()
            : Carbon::parse($firstReport)->startOfDay();

        // 3. Tentukan endDate
        $endDate = $endDateParam
            ? Carbon::parse($endDateParam)->startOfDay()
            : Carbon::now()->startOfDay();

        // 2. Tentukan startDate
        // $startDate = $startDateParam
        //     ? self::safeDate($startDateParam, Carbon::parse($firstReport)->startOfDay())
        //     : Carbon::parse($firstReport)->startOfDay();

        // // 3. Tentukan endDate
        // $endDate = $endDateParam
        //     ? self::safeDate($endDateParam, Carbon::now()->startOfDay())
        //     : Carbon::now()->startOfDay();

        if ($endDate->lt($startDate)) {
            $endDate = $startDate;
        }

        // 4. Hitung total hari kalender
        $totalHari = $startDate->diffInDays($endDate) + 1;

        // 5. Hitung poin maksimum harian
        $maxPoinHarian = Pertanyaan::where('kategori', 'umum')
            ->with('pilihanJawabans')
            ->get()
            ->sum(fn($p) => $p->pilihanJawabans->max('poin') ?? 0);

        if ($maxPoinHarian == 0) {
            $maxPoinHarian = 10; // default
        }

        // 6. Hitung total poin capaian (actual)
        $totalCapaian = DB::table('laporan_ibadahs')
            ->join('jawaban_laporans', 'laporan_ibadahs.id', '=', 'jawaban_laporans.laporan_ibadah_id')
            ->where('laporan_ibadahs.mahasiswa_id', $mahasiswaId)
            ->whereBetween('laporan_ibadahs.tanggal_laporan', [$startDate, $endDate])
            ->sum('jawaban_laporans.poin_didapat');

        $totalCapaian = (int) $totalCapaian;

        // 7. Hitung total hari haid (khusus perempuan)
        $totalHaid = 0;
        if ($gender == 'P') {
            $totalHaid = DB::table('laporan_ibadahs')
                ->where('mahasiswa_id', $mahasiswaId)
                ->whereBetween('tanggal_laporan', [$startDate, $endDate])
                ->where('is_haid', 1)
                ->count();
        }

        // 8. Hitung hari efektif (tanpa haid)
        $hariEfektif = $gender == 'P'
            ? max(0, $totalHari - $totalHaid)
            : $totalHari;

        // 9. Hitung target poin
        $totalStandar = $hariEfektif * $maxPoinHarian;

        // 10. Hitung persentase
        if ($totalStandar > 0) {
            $persentase = round(($totalCapaian / $totalStandar) * 100, 1);
        } elseif ($totalHari > 0 && $totalHaid >= $totalHari) {
            $persentase = 100; // semua hari haid
        } else {
            $persentase = 0;
        }

        return [
            'periode' => $startDate->translatedFormat('d M Y') . ' s.d ' . $endDate->translatedFormat('d M Y'),
            'total_hari' => $totalHari,
            'total_haid' => $totalHaid,
            'target_poin' => $totalStandar,
            'capaian_poin' => $totalCapaian,
            'persentase' => $persentase
        ];
    }

    private static function safeDate($value, $fallback)
    {
        try {
            if (\Carbon\Carbon::hasFormat($value, 'Y-m-d')) {
                return \Carbon\Carbon::createFromFormat('Y-m-d', $value);
            }
        } catch (\Exception $e) {
        }

        return $fallback;
    }
}
