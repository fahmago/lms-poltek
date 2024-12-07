<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MateriMahasiswaController extends Controller
{
    public function index(Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }

        // Mengambil kelas berdasarkan mahasiswa dengan relasi tugas
        $kelas = $mahasiswa->kelas()
            ->with(['matkul', 'dosen.user', 'materis']) // Memuat relasi terkait
            ->withCount('materis')
            ->whereHas('materis') // Hanya kelas yang memiliki tugas
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas.nama_kelas', 'like', '%' . $search . '%') // Cari di nama_kelas
                            ->orWhere('kelas.kode_kelas', 'like', '%' . $search . '%') // Cari di kode_kelas
                            ->orWhereHas('matkul', function ($q) use ($search) {
                                $q->where('matkuls.nama_matkul', 'like', '%' . $search . '%'); // Cari di nama_matkul
                            });
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
        return inertia('My/Mahasiswa/Materi/Index', [
            'kelas' => $kelas, // Data kelas dengan paginasi
        ]);
    }

    public function showMateri($kode_kelas, Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }

        // Cari kelas berdasarkan kode_kelas
        $kelas = $mahasiswa->kelas()
            ->with(['matkul']) // Load relasi matkul
            ->where('kelas.kode_kelas', $kode_kelas)
            ->first();

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        // Ambil tugas terkait dengan pagination
        $materis = $kelas->materis()
            // ->with(['pengumpulanTugas' => function ($query) use ($mahasiswa) {
            //     $query->where('mahasiswa_id', $mahasiswa->id);
            // }])
            ->when($request->q, function ($query, $search) {
                $query->where('judul', 'like', "%$search%")
                    ->orWhere('deskripsi', 'like', "%$search%");
            })
            ->paginate(10);

            // return $kelas;

        return inertia('My/Mahasiswa/Materi/Show', [
            'kelas' => $kelas->only(['kode_kelas', 'nama_kelas', 'tahun', 'matkul']),
            'materis' => $materis
        ]);
    }
}
