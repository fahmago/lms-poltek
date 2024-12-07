<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\PengumpulanTugas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TugasMahasiswaController extends Controller
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
            ->with(['matkul', 'dosen.user', 'tugas']) // Memuat relasi terkait
            ->withCount('tugas')
            ->whereHas('tugas') // Hanya kelas yang memiliki tugas
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
        return inertia('My/Mahasiswa/Tugas/Index', [
            'kelas' => $kelas, // Data kelas dengan paginasi
        ]);
    }

    public function showTugas($kode_kelas, Request $request)
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
        $tugas = $kelas->tugas()
            ->with(['pengumpulanTugas' => function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            }])
            ->when($request->q, function ($query, $search) {
                $query->where('judul', 'like', "%$search%")
                    ->orWhere('deskripsi', 'like', "%$search%");
            })
            ->paginate(10);

            // return $tugas;

        return inertia('My/Mahasiswa/Tugas/Show', [
            'kelas' => $kelas->only(['kode_kelas', 'nama_kelas', 'tahun', 'matkul']),
            'tugas' => $tugas
        ]);
    }

    public function sendTugas(Request $request)
    {
        $validated = $request->validate([
            'tugas_id' => 'required|exists:tugas,id', // Pastikan tugas_id sesuai dengan tabel tugas
            'kode_kelas' => 'required|exists:kelas,kode_kelas', // Pastikan kode_kelas sesuai dengan tabel kelas
            'link_tugas' => 'required|url',
            'kendala' => 'required|string',
        ]);

        try {
            PengumpulanTugas::create([
                'tugas_id' => $validated['tugas_id'],
                'kode_kelas' => $validated['kode_kelas'],
                'mahasiswa_id' => Auth::user()->mahasiswa->id,
                'link_tugas' => $validated['link_tugas'],
                'kendala' => $validated['kendala'] ?? null,
                'tanggal_dikirim' => now(),
            ]);
            return redirect()->back()->with('success', 'Tugas berhasil dikirim!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan data.']);
        }
    }


}
