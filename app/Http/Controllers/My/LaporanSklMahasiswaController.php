<?php

namespace App\Http\Controllers\My;

use App\Helpers\AbsensiHelper;
use App\Helpers\AvatarHelper;
use App\Helpers\IbadahHelper;
use App\Helpers\SklHelper;
use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Support\Facades\Auth;

class LaporanSklMahasiswaController extends Controller
{
    
    public function laporanSklMahasiswa($mahasiswaUuid)
    {
        $user = Auth::user();

        if ($user->mahasiswa && $user->mahasiswa->uuid !== $mahasiswaUuid) {
            abort(403);
        }

        $mahasiswa = Mahasiswa::with('user')->where('uuid', $mahasiswaUuid)->firstOrFail();

        $kelas = $mahasiswa->kelasHarians()
            ->with(['dosen.user', 'tugasPekanans', 'projectSemesters', 'portofolios', 'bukus', 'sertifikats'])
            ->where('tahun', date('Y'))
            ->whereHas('kategoriKelasHarian', fn($q) => $q->where('jenis', 'IT'))
            ->firstOrFail();

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
