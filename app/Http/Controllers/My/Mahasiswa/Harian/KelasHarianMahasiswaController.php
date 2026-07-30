<?php

namespace App\Http\Controllers\My\Mahasiswa\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KelasHarianMahasiswaController extends Controller
{
    public function index1(Request $request) 
    {
        $mahasiswa = Auth::user()->mahasiswa;
        $kelas = $mahasiswa->kelasHarians()
            ->with('dosen.user') 
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas_harians.nama_kelas', 'like', '%' . $search . '%') 
                            ->orWhere('kelas_harians.kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })->paginate(10);

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends(['q' => $request->q]);

        return inertia('My/Mahasiswa/Harian/KelasHarian/Index', [
            'kelas' => $kelas, 
        ]);
    }

    public function index(Request $request) 
    {
        // 1. Ambil Tahun untuk Filter
        $availableYears = KelasHarian::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // 2. Set Default Filter
        $selectedYear = $request->input('tahun', date('Y'));
        $selectedSemester = $request->input('semester', 'all');

        $mahasiswa = Auth::user()->mahasiswa;

        // 3. Query Data dengan Filter
        $kelas = $mahasiswa->kelasHarians()
            ->with('dosen.user') 
            // Filter Search
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas_harians.nama_kelas', 'like', '%' . $search . '%') 
                             ->orWhere('kelas_harians.kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun (Spesifik ke tabel kelas_harians)
            ->when($selectedYear !== 'all', function($q) use ($selectedYear) {
                $q->where('kelas_harians.tahun', $selectedYear);
            })
            // Filter Semester
            ->when($selectedSemester !== 'all', function($q) use ($selectedSemester) {
                $q->where('kelas_harians.semester', $selectedSemester);
            })
            ->orderBy('kelas_harians.created_at', 'desc')
            ->paginate(10);

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        // Append query params
        $kelas->appends([
            'q' => $request->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Mahasiswa/Harian/KelasHarian/Index', [
            'kelas' => $kelas, 
            'availableYears' => $availableYears, // Kirim data tahun
            'filters' => [ // Kirim state filter
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => $request->q
            ]
        ]);
    }
}
