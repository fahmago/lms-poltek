<?php

namespace App\Http\Controllers\My;

use App\Helpers\AbsensiHelper;
use App\Helpers\AvatarHelper;
use App\Helpers\IbadahHelper;
use App\Helpers\SklHelper;
use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\Mahasiswa;

class DetailSklMahasiswaController extends Controller
{
    // Kode Asli -> https://pastecode.dev/s/6xulnp8v
    public function detailMahasiswa($mahasiswaUuid, $kelasUuid)
    {
        // 1. DATA KELAS FOKUS
        $kelas = KelasHarian::with(['dosen.user', 'tugasPekanans', 'projectSemesters', 'portofolios', 'bukus', 'sertifikats'])
            ->where('uuid', $kelasUuid)->firstOrFail();

        // 2. DATA MAHASISWA
        $mahasiswa = Mahasiswa::with(['user','prodi'])->where('uuid', $mahasiswaUuid)->firstOrFail();

        // 🔥 Helper: SKL
        $skl = SklHelper::hitungSklMahasiswa($kelas, $mahasiswa->id);

        // 🔥 Helper: Absensi semua kelas
        $absensi = AbsensiHelper::rekapAbsensiSemuaKelas($mahasiswa);

        // 🔥 Helper: Ibadah
        $ibadahSummary = IbadahHelper::hitungStatistikIbadah(
            $mahasiswa->id,
            $mahasiswa->gender,
            // $startDate,
            // $endDate
        );

        return view('prints.skl.detail_mahasiswa', [
            'avatar' => AvatarHelper::getAvatarData($mahasiswa),
            'mahasiswa' => $mahasiswa,
            'kelas' => $kelas,
            'history' => $absensi['history'],
            'chartData' => [
                'labels' => array_map('strtoupper', $skl['categories']),
                'targets' => $skl['targets'],
                'actuals' => $skl['actuals'],
            ],
            'attendanceChart' => $absensi['chart'],
            'attendanceTable' => $absensi['table'],
            'ibadahSummary' => $ibadahSummary,
            'tanggal' => now()->translatedFormat('d F Y')
        ]);
    }

}
