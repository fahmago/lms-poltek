<?php

namespace App\Http\Controllers\My\Mahasiswa\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\PengumpulanTugasHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TugasHarianMahasiswaController extends Controller
{
    public function index1(Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }

        // Mengambil kelas berdasarkan mahasiswa dengan relasi tugas
        $kelas = $mahasiswa->kelasHarians()
            ->with(['dosen.user', 'tugasHarians']) // Memuat relasi terkait
            ->withCount('tugasHarians')
            ->whereHas('tugasHarians') // Hanya kelas yang memiliki tugas
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas_harians.nama_kelas', 'like', '%' . $search . '%') // Cari di nama_kelas
                            ->orWhere('kelas_harians.kode_kelas_harian', 'like', '%' . $search . '%'); // Cari di kode_kelas
                            
                });
            })
            ->paginate(10);

        // Transformasi data jika perlu menyembunyikan field tertentu
        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden(['kode_enroll']);
        });

        // Menambahkan parameter pencarian ke link paginasi
        $kelas->appends(['q' => $request->q]);

        // return $kelas;

        // Mengirim data ke view menggunakan Inertia
            return inertia('My/Mahasiswa/Harian/TugasHarian/Index', [
            'kelas' => $kelas, // Data kelas dengan paginasi
        ]);
    }

    public function index(Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }

        // 1. Ambil Tahun untuk Filter
        $availableYears = KelasHarian::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // 2. Set Default Filter
        $selectedYear = $request->input('tahun', date('Y'));
        $selectedSemester = $request->input('semester', 'all');

        // 3. Query Data
        $kelas = $mahasiswa->kelasHarians()
            ->with(['dosen.user', 'tugasHarians'])
            ->withCount('tugasHarians')
            ->whereHas('tugasHarians') // Hanya kelas yang ada tugasnya
            // Filter Search
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas_harians.nama_kelas', 'like', '%' . $search . '%')
                             ->orWhere('kelas_harians.kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun (Spesifik tabel kelas_harians)
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
            return $kelasItem->makeHidden(['kode_enroll']);
        });

        $kelas->appends([
            'q' => $request->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Mahasiswa/Harian/TugasHarian/Index', [
            'kelas' => $kelas,
            'availableYears' => $availableYears, // Kirim data tahun
            'filters' => [ // Kirim state filter
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => $request->q
            ]
        ]);
    }

    public function showTugas($kode_kelas_harian, Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }

        // Cari kelas berdasarkan kode_kelas_harian
        $kelas = $mahasiswa->kelasHarians()
            // ->with(['matkul']) // Load relasi matkul
            ->where('kelas_harians.kode_kelas_harian', $kode_kelas_harian)
            ->first();

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        // return $kelas;

        // Ambil tugas terkait dengan pagination
        $tugas = $kelas->tugasHarians()
            ->with(['pengumpulanTugasHarians' => function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            }])
            ->when($request->q, function ($query, $search) {
                $query->where('judul', 'like', "%$search%")
                    ->orWhere('deskripsi', 'like', "%$search%");
            })
            ->paginate(10);

            // return $tugas;

            return inertia('My/Mahasiswa/Harian/TugasHarian/Show', [
            'kelas' => $kelas->only(['kode_kelas_harian', 'nama_kelas', 'tahun', 'semester']),
            'tugas' => $tugas
        ]);
    }

    public function sendTugas(Request $request)
    {
        // return $request;
        $validated = $request->validate([
            'tugas_harian_id' => 'required|exists:tugas_harians,id', // Pastikan tugas_id sesuai dengan tabel tugas
            'kode_kelas_harian' => 'required|exists:kelas_harians,kode_kelas_harian', // Pastikan kode_kelas sesuai dengan tabel kelas
            'link_tugas' => 'required|url',
            'kendala' => 'required|string',
        ]);
        // return $validated;

        // try {
            PengumpulanTugasHarian::create([
                'tugas_harian_id' => $validated['tugas_harian_id'],
                'kode_kelas_harian' => $validated['kode_kelas_harian'],
                'mahasiswa_id' => Auth::user()->mahasiswa->id,
                'link_tugas' => $validated['link_tugas'],
                'kendala' => $validated['kendala'] ?? null,
                'tanggal_dikirim' => now(),
            ]);
            return redirect()->back()->with('success', 'Tugas berhasil dikirim!');
        // } catch (\Exception $e) {
        //     return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data.']);
        // }
    }
}
