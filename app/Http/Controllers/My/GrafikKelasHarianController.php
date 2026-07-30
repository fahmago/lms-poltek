<?php

namespace App\Http\Controllers\My;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KategoriKelasHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GrafikKelasHarianController extends Controller
{
    public function index(Request $request)
    {
        $kategoriList = KategoriKelasHarian::orderBy('nama_kategori', 'asc')->get(['id', 'nama_kategori']);
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get(['id', 'tahun_angkatan', 'nama_angkatan']);

        return inertia('My/Grafik/KelasHarian/Index2', [
            'kategoriList' => $kategoriList,
            'angkatans' => $angkatans,
        ]);
    }

    public function getClasses(Request $request)
    {
        $data = $request->validate([
            'tahun_angkatan' => 'required|exists:angkatans,tahun_angkatan',
            'kategori_id' => 'required|integer|exists:kategori_kelas_harians,id',
            'semester' => 'required|integer|between:1,8',
        ]);

        $classes = KelasHarian::where('tahun', $data['tahun_angkatan'])
            ->where('semester', $data['semester'])
            ->where('kategori_kelas_harian_id', $data['kategori_id'])
            ->with('dosen.user')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $formattedClasses = $classes->map(function ($kelas) {
            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'nama_dosen' => $kelas->dosen->user->name ?? 'Dosen N/A',
            ];
        });

        return response()->json($formattedClasses);
    }

    // public function getAttendanceData1(Request $request)
    // {
    //     $validated = $request->validate([
    //         'kelas_harian_ids' => 'required|array|min:1',
    //         'kelas_harian_ids.*' => 'exists:kelas_harians,id',
    //         'range' => 'nullable|integer',
    //         'start_date' => 'nullable|date',
    //         'end_date' => 'nullable|date|after_or_equal:start_date',
    //     ]);

    //     // Tentukan rentang tanggal
    //     if ($request->has('start_date') && $request->has('end_date')) {
    //         $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
    //         $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
    //     } else {
    //         $range = $request->query('range', 7);
    //         $startDate = Carbon::now()->subDays($range)->startOfDay();
    //         $endDate = Carbon::now()->endOfDay();
    //     }
    //     $dateRangeString = $startDate->isoFormat('D MMM YYYY') . ' - ' . $endDate->isoFormat('D MMM YYYY');

    //     // Ambil kelas yang dipilih
    //     $kelasHarians = KelasHarian::whereIn('id', $validated['kelas_harian_ids'])
    //         ->with(['dosen.user'])
    //         ->orderBy('nama_kelas', 'asc')
    //         ->get();

    //     $labels = [];
    //     $datasets = [
    //         ['label' => 'Hadir', 'data' => [], 'backgroundColor' => 'rgba(75, 192, 192, 0.6)'],
    //         ['label' => 'Sakit', 'data' => [], 'backgroundColor' => 'rgba(255, 206, 86, 0.6)'],
    //         ['label' => 'Izin', 'data' => [], 'backgroundColor' => 'rgba(54, 162, 235, 0.6)'],
    //         ['label' => 'Alpha', 'data' => [], 'backgroundColor' => 'rgba(255, 99, 132, 0.6)'],
    //     ];

    //     // Hitung rekap untuk setiap kelas
    //     foreach ($kelasHarians as $kelas) {
    //         $labels[] = $kelas->nama_kelas . ' (' . ($kelas->dosen->user->name ?? 'N/A') . ')';

    //         $rekap = DB::table('absensi_harians')
    //             ->join('jadwal_harians', 'absensi_harians.jadwal_harian_id', '=', 'jadwal_harians.id')
    //             ->where('absensi_harians.kelas_harian_id', $kelas->id)
    //             ->whereBetween('jadwal_harians.tanggal', [$startDate->toDateString(), $endDate->toDateString()])
    //             ->select('status', DB::raw('count(*) as total'))
    //             ->groupBy('status')
    //             ->pluck('total', 'status');

    //         $datasets[0]['data'][] = $rekap->get('hadir', 0);
    //         $datasets[1]['data'][] = $rekap->get('sakit', 0);
    //         $datasets[2]['data'][] = $rekap->get('izin', 0);
    //         $datasets[3]['data'][] = $rekap->get('alpha', 0);
    //     }

    //     $studentRecap = $this->prepareStudentRecap($validated['kelas_harian_ids'], $startDate, $endDate);

    //     return response()->json([
    //         'chartData' => ['labels' => $labels, 'datasets' => $datasets],
    //         'studentRecap' => $studentRecap,
    //         'dateRange' => $dateRangeString,
    //     ]);
    // }

    public function getAttendanceData(Request $request)
    {
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
            'range' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // Tentukan rentang tanggal
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
        } else {
            $range = $request->query('range', 7);
            $startDate = Carbon::now()->subDays($range)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }
        $dateRangeString = $startDate->isoFormat('D MMM YYYY') . ' - ' . $endDate->isoFormat('D MMM YYYY');

        // Ambil kelas yang dipilih
        $kelasHarians = KelasHarian::whereIn('id', $validated['kelas_harian_ids'])
            ->with(['dosen.user'])
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $labels = [];
        $datasets = [
            ['label' => 'Hadir', 'data' => [], 'backgroundColor' => 'rgba(75, 192, 192, 0.6)'],
            ['label' => 'Sakit', 'data' => [], 'backgroundColor' => 'rgba(255, 206, 86, 0.6)'],
            ['label' => 'Izin', 'data' => [], 'backgroundColor' => 'rgba(54, 162, 235, 0.6)'],
            ['label' => 'Alpha', 'data' => [], 'backgroundColor' => 'rgba(255, 99, 132, 0.6)'],
        ];

        // --- MULAI PERUBAHAN ---
        // Inisialisasi variabel untuk statistik keseluruhan
        $totalHadir = 0;
        $totalSakit = 0;
        $totalIzin = 0;
        $totalAlpha = 0;
        // --- SELESAI PERUBAHAN ---

        // Hitung rekap untuk setiap kelas
        foreach ($kelasHarians as $kelas) {

            // ✅ Ambil 3 huruf UPPERCASE untuk label (Kode ini sudah benar)
            $labels[] = $kelas->nama_kelas . ' (' . str_replace(' ', '', strtoupper(substr($kelas->dosen->user->name ?? 'N/A', 0, 5))) . ')';

            $rekap = DB::table('absensi_harians')
                ->join('jadwal_harians', 'absensi_harians.jadwal_harian_id', '=', 'jadwal_harians.id')
                ->where('absensi_harians.kelas_harian_id', $kelas->id) // ⬅️ Filter per KELAS
                ->whereBetween('jadwal_harians.tanggal', [$startDate->toDateString(), $endDate->toDateString()]) // ⬅️ Filter TANGGAL
                ->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status');

            // 1. Ambil jumlah absolut (untuk grafik per kelas)
            $hadir = $rekap->get('hadir', 0);
            $sakit = $rekap->get('sakit', 0);
            $izin = $rekap->get('izin', 0);
            $alpha = $rekap->get('alpha', 0);

            // --- MULAI PERUBAHAN ---
            // 2. Akumulasi ke total keseluruhan
            $totalHadir += $hadir;
            $totalSakit += $sakit;
            $totalIzin += $izin;
            $totalAlpha += $alpha;
            // --- SELESAI PERUBAHAN ---

            // 3. Hitung total per kelas
            $total = $hadir + $sakit + $izin + $alpha;

            // 4. Hitung persentase per kelas (dengan round())
            if ($total > 0) {
                // $persenHadir = round(($hadir / $total) * 100);
                // $persenSakit = round(($sakit / $total) * 100);
                // $persenIzin = round(($izin / $total) * 100);
                // $persenAlpha = round(($alpha / $total) * 100);
                $persenSakit = round(($sakit / $total) * 100);
                $persenIzin = round(($izin / $total) * 100);
                $persenAlpha = round(($alpha / $total) * 100);
                $persenHadir = 100 - $persenSakit - $persenIzin - $persenAlpha;
            } else {
                $persenHadir = 0;
                $persenSakit = 0;
                $persenIzin = 0;
                $persenAlpha = 0;
            }

            // 5. Masukkan data persentase ke dataset (untuk grafik bar)
            $datasets[0]['data'][] = $persenHadir;
            $datasets[1]['data'][] = $persenSakit;
            $datasets[2]['data'][] = $persenIzin;
            $datasets[3]['data'][] = $persenAlpha;
        } // --- Akhir foreach ---


        // --- MULAI PERUBAHAN BARU ---
        // 6. Hitung Statistik Keseluruhan (Overall) setelah loop selesai
        $grandTotal = $totalHadir + $totalSakit + $totalIzin + $totalAlpha;
        $overallStats = [];

        // Tetapkan warna yang konsisten dengan grafik bar
        $colors = [
            'hadir' => 'bg-cyan-500', // Sesuai rgba(75, 192, 192)
            'sakit' => 'bg-yellow-500', // Sesuai rgba(255, 206, 86)
            'izin' => 'bg-blue-500',  // Sesuai rgba(54, 162, 235)
            'alpha' => 'bg-red-500',   // Sesuai rgba(255, 99, 132)
        ];

        if ($grandTotal > 0) {
            $overallStats = [
                ['label' => 'HADIR', 'percentage' => round(($totalHadir / $grandTotal) * 100), 'color' => $colors['hadir']],
                ['label' => 'SAKIT', 'percentage' => round(($totalSakit / $grandTotal) * 100), 'color' => $colors['sakit']],
                ['label' => 'IZIN', 'percentage' => round(($totalIzin / $grandTotal) * 100), 'color' => $colors['izin']],
                ['label' => 'ALPHA', 'percentage' => round(($totalAlpha / $grandTotal) * 100), 'color' => $colors['alpha']],
            ];
        } else {
            // Jika tidak ada data sama sekali
            $overallStats = [
                ['label' => 'HADIR', 'percentage' => 0, 'color' => $colors['hadir']],
                ['label' => 'SAKIT', 'percentage' => 0, 'color' => $colors['sakit']],
                ['label' => 'IZIN', 'percentage' => 0, 'color' => $colors['izin']],
                ['label' => 'ALPHA', 'percentage' => 0, 'color' => $colors['alpha']],
            ];
        }
        // --- SELESAI PERUBAHAN BARU ---

        $studentRecap = $this->prepareStudentRecap($validated['kelas_harian_ids'], $startDate, $endDate);

        return response()->json([
            'chartData' => ['labels' => $labels, 'datasets' => $datasets],
            'studentRecap' => $studentRecap,
            'dateRange' => $dateRangeString,
            'overallStats' => $overallStats,
        ]);
    }

    private function prepareStudentRecap($kelasHarianIds, $startDate, $endDate)
    {
        $rekapMahasiswa = DB::table('absensi_harians')
            ->join('mahasiswas', 'absensi_harians.mahasiswa_id', '=', 'mahasiswas.id')
            ->join('users as student_user', 'mahasiswas.user_id', '=', 'student_user.id') // Alias untuk user mahasiswa
            ->join('kelas_harians', 'absensi_harians.kelas_harian_id', '=', 'kelas_harians.id')
            ->join('dosens', 'kelas_harians.dosen_id', '=', 'dosens.id')
            ->join('users as dosen_user', 'dosens.user_id', '=', 'dosen_user.id') // Alias untuk user dosen
            ->join('jadwal_harians', 'absensi_harians.jadwal_harian_id', '=', 'jadwal_harians.id')
            ->whereIn('absensi_harians.kelas_harian_id', $kelasHarianIds)
            ->whereIn('absensi_harians.status', ['sakit', 'izin', 'alpha'])
            ->whereBetween('jadwal_harians.tanggal', [$startDate->toDateString(), $endDate->toDateString()])
            ->select(
                'student_user.name',
                'mahasiswas.nim',
                'kelas_harians.nama_kelas', // Ambil Nama Kelas
                'dosen_user.name as nama_dosen', // Ambil Nama Dosen
                DB::raw("COUNT(CASE WHEN absensi_harians.status = 'sakit' THEN 1 END) as total_sakit"),
                DB::raw("COUNT(CASE WHEN absensi_harians.status = 'izin' THEN 1 END) as total_izin"),
                DB::raw("COUNT(CASE WHEN absensi_harians.status = 'alpha' THEN 1 END) as total_alpha"),
                DB::raw("GROUP_CONCAT(CASE WHEN absensi_harians.status = 'sakit' THEN DATE_FORMAT(jadwal_harians.tanggal, '%d-%m-%y') END ORDER BY jadwal_harians.tanggal ASC SEPARATOR ', ') as dates_sakit"),
                DB::raw("GROUP_CONCAT(CASE WHEN absensi_harians.status = 'izin' THEN DATE_FORMAT(jadwal_harians.tanggal, '%d-%m-%y') END ORDER BY jadwal_harians.tanggal ASC SEPARATOR ', ') as dates_izin"),
                DB::raw("GROUP_CONCAT(CASE WHEN absensi_harians.status = 'alpha' THEN DATE_FORMAT(jadwal_harians.tanggal, '%d-%m-%y') END ORDER BY jadwal_harians.tanggal ASC SEPARATOR ', ') as dates_alpha"),
                DB::raw("COUNT(*) as total_absences")
            )
            ->groupBy('mahasiswas.id', 'student_user.name', 'mahasiswas.nim', 'kelas_harians.id', 'kelas_harians.nama_kelas', 'dosen_user.name')
            ->orderBy('total_absences', 'desc')
            ->limit(50)
            ->get();

        return $rekapMahasiswa;
    }
}
