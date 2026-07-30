<?php

namespace App\Http\Controllers\My;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GrafikController extends Controller
{
    public function index(Request $request)
    {
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();
        
        $chartDataResult = $this->prepareChartData($request);
        $studentRecapResult = $this->prepareStudentRecap($request);

        return inertia('My/Grafik/Index', [
            'prodis' => $prodis,
            'initialChartData' => $chartDataResult['data'],
            'initialStudentRecap' => $studentRecapResult['data'],
            'initialDateRange' => $chartDataResult['dateRange'], 
        ]);
    }

    /**
     * Endpoint API yang dipanggil Axios untuk mendapatkan data baru berdasarkan filter.
     */
    public function getAttendanceData(Request $request)
    {
        $chartDataResult = $this->prepareChartData($request);
        $studentRecapResult = $this->prepareStudentRecap($request);

        // Mengembalikan semua data yang dibutuhkan dalam format JSON
        return response()->json([
            'chartData' => $chartDataResult['data'],
            'studentRecap' => $studentRecapResult['data'],
            'dateRange' => $chartDataResult['dateRange'],
        ]);
    }

    /**
     * Menyiapkan data agregat dan rentang tanggal untuk grafik.
     * Sekarang mengembalikan array [data, dateRange].
     */
    private function prepareChartData(Request $request)
    {
        $request->validate([
            'prodi' => 'nullable|string|exists:prodis,kode_prodi',
            'range' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'gender' => 'nullable|string|in:L,P',
        ]);

        $prodiId = $request->query('prodi');
        $gender = $request->query('gender');

        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
        } else {
            $range = $request->query('range', 7);
            $startDate = Carbon::now()->subDays($range)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }
        
        $rekap = DB::table('absensi_harians')
            ->join('mahasiswas', 'absensi_harians.mahasiswa_id', '=', 'mahasiswas.id')
            ->join('jadwal_harians', 'absensi_harians.jadwal_harian_id', '=', 'jadwal_harians.id')
            ->when($prodiId, fn ($q, $p) => $q->where('mahasiswas.kode_prodi', $p))
            ->when($gender, fn ($q, $g) => $q->where('mahasiswas.gender', $g))
            ->whereBetween('jadwal_harians.tanggal', [$startDate->toDateString(), $endDate->toDateString()])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $labels = [''];
        $datasets = [
            ['label' => 'Hadir', 'data' => [$rekap->get('hadir', 0)], 'backgroundColor' => 'rgba(75, 192, 192, 0.6)', 'borderColor' => 'rgba(75, 192, 192, 1)', 'borderWidth' => 1],
            ['label' => 'Sakit', 'data' => [$rekap->get('sakit', 0)], 'backgroundColor' => 'rgba(255, 206, 86, 0.6)', 'borderColor' => 'rgba(255, 206, 86, 1)', 'borderWidth' => 1],
            ['label' => 'Izin', 'data' => [$rekap->get('izin', 0)], 'backgroundColor' => 'rgba(54, 162, 235, 0.6)', 'borderColor' => 'rgba(54, 162, 235, 1)', 'borderWidth' => 1],
            ['label' => 'Alpha', 'data' => [$rekap->get('alpha', 0)], 'backgroundColor' => 'rgba(255, 99, 132, 0.6)', 'borderColor' => 'rgba(255, 99, 132, 1)', 'borderWidth' => 1],
        ];

        // Kembalikan data dan rentang tanggal yang digunakan
        return [
            'data' => ['labels' => $labels, 'datasets' => $datasets],
            'dateRange' => $startDate->isoFormat('D MMM YYYY') . ' - ' . $endDate->isoFormat('D MMM YYYY'),
        ];
    }

    /**
     * Menyiapkan data rekapitulasi per mahasiswa (tidak ada paginasi).
     * Sekarang mengembalikan array [data, dateRange].
     */
    private function prepareStudentRecap(Request $request)
    {
        $request->validate([
            'prodi' => 'nullable|string|exists:prodis,kode_prodi',
            'range' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'gender' => 'nullable|string|in:L,P',
        ]);

        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
        } else {
            $range = $request->query('range', 7);
            $startDate = Carbon::now()->subDays($range)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }
        
        $rekapMahasiswa = DB::table('absensi_harians')
            ->join('mahasiswas', 'absensi_harians.mahasiswa_id', '=', 'mahasiswas.id')
            ->join('users', 'mahasiswas.user_id', '=', 'users.id')
            ->join('prodis', 'mahasiswas.kode_prodi', '=', 'prodis.kode_prodi')
            ->join('jadwal_harians', 'absensi_harians.jadwal_harian_id', '=', 'jadwal_harians.id')
            ->join('kelas_harians', 'absensi_harians.kelas_harian_id', '=', 'kelas_harians.id')
            ->whereIn('absensi_harians.status', ['sakit', 'izin', 'alpha'])
            ->whereBetween('jadwal_harians.tanggal', [$startDate->toDateString(), $endDate->toDateString()])
            ->when($request->query('prodi'), fn($q, $p) => $q->where('mahasiswas.kode_prodi', $p))
            ->when($request->query('gender'), fn($q, $g) => $q->where('mahasiswas.gender', $g))
            ->select(
                'users.name', 'mahasiswas.nim', 'prodis.nama_prodi',
                DB::raw("COUNT(CASE WHEN absensi_harians.status = 'sakit' THEN 1 END) as total_sakit"),
                DB::raw("COUNT(CASE WHEN absensi_harians.status = 'izin' THEN 1 END) as total_izin"),
                DB::raw("COUNT(CASE WHEN absensi_harians.status = 'alpha' THEN 1 END) as total_alpha"),
                DB::raw("GROUP_CONCAT(CASE WHEN absensi_harians.status = 'sakit' THEN CONCAT(DATE_FORMAT(jadwal_harians.tanggal, '%d-%m-%y'), ':', kelas_harians.nama_kelas) END ORDER BY jadwal_harians.tanggal ASC SEPARATOR '|') as dates_sakit"),
                DB::raw("GROUP_CONCAT(CASE WHEN absensi_harians.status = 'izin' THEN CONCAT(DATE_FORMAT(jadwal_harians.tanggal, '%d-%m-%y'), ':', kelas_harians.nama_kelas) END ORDER BY jadwal_harians.tanggal ASC SEPARATOR '|') as dates_izin"),
                DB::raw("GROUP_CONCAT(CASE WHEN absensi_harians.status = 'alpha' THEN CONCAT(DATE_FORMAT(jadwal_harians.tanggal, '%d-%m-%y'), ':', kelas_harians.nama_kelas) END ORDER BY jadwal_harians.tanggal ASC SEPARATOR '|') as dates_alpha"),
                DB::raw("COUNT(*) as total_absences")
            )
            ->groupBy('mahasiswas.id', 'users.name', 'mahasiswas.nim', 'prodis.nama_prodi')
            ->orderBy('total_absences', 'desc')
            ->limit(70)
            ->get();

        // Kembalikan data dan rentang tanggal yang digunakan
        return [
            'data' => $rekapMahasiswa,
            'dateRange' => $startDate->isoFormat('D MMM YYYY') . ' - ' . $endDate->isoFormat('D MMM YYYY'),
        ];
    }

}
