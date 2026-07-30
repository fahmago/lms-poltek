<?php

namespace App\Http\Controllers\My\Dosen\Harian;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\KelasHarianMahasiswa;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KelasHarianDosenController extends Controller
{
    public function index1()
    {
        $kelas = KelasHarian::withCount('kelasHarianMahasiswas')->when(request()->q, function($kelas) {
            $search = request()->q;
            $kelas = $kelas->where(function ($query) use ($search) {
                $query->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
            });
        })->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->with(['dosen.user'])->paginate(10);

        $kelas->getCollection()->transform(function($item) {
            $item->jam_selesai = $item->jamSelesai();
            return $item;
        });

        $kelas->appends(['q' => request()->q]);

        return inertia('My/Dosen/Harian/KelasHarian/Index', [
            'kelas' => $kelas,
        ]);        
    }

    public function index()
    {
        // 1. Ambil daftar Tahun yang unik dari database untuk dropdown filter
        // Diurutkan dari yang terbaru
        $availableYears = KelasHarian::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // 2. Tentukan Default Filter
        // Jika tidak ada request 'tahun', gunakan tahun saat ini (date('Y'))
        $selectedYear = request()->input('tahun', date('Y'));
        $selectedSemester = request()->input('semester', 'all');

        // 3. Query Data
        $kelas = KelasHarian::withCount('kelasHarianMahasiswas')
            ->when(request()->q, function($kelas) {
                $search = request()->q;
                $kelas->where(function ($query) use ($search) {
                    $query->where('nama_kelas', 'like', '%' . $search . '%')
                          ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun (Aktif jika bukan 'all')
            ->when($selectedYear !== 'all', function($q) use ($selectedYear) {
                $q->where('tahun', $selectedYear);
            })
            // Filter Semester (Aktif jika bukan 'all')
            ->when($selectedSemester !== 'all', function($q) use ($selectedSemester) {
                $q->where('semester', $selectedSemester);
            })
            ->whereHas('dosen', function($q) {
                $q->where('user_id', Auth::user()->id);
            })
            ->with(['dosen.user'])
            ->orderBy('created_at', 'desc') // Opsional: urut data terbaru di atas
            ->paginate(10);

        // Transform data (menghitung jam selesai)
        $kelas->getCollection()->transform(function($item) {
            $item->jam_selesai = $item->jamSelesai();
            return $item;
        });

        // Append query params agar pagination tidak mereset filter
        $kelas->appends([
            'q' => request()->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Dosen/Harian/KelasHarian/Index', [
            'kelas' => $kelas,
            'availableYears' => $availableYears, // Kirim list tahun ke React
            'filters' => [ // Kirim status filter saat ini
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => request()->q
            ]
        ]);        
    }

    public function show($uuidKelas)
    {
        $kelas = KelasHarian::where('uuid', $uuidKelas)
        ->with([
            'dosen',
            'kelasHarianMahasiswas.mahasiswa.user',
        ])
        ->firstOrFail();

    // Pencarian dan paginasi mahasiswa
    $mahasiswa = KelasHarianMahasiswa::where('kelas_harian_id', $kelas->id)
        ->whereHas('mahasiswa', function ($query) {
            if (request()->q) {
                $search = request()->q;
                $query->where('nim', 'like', '%' . $search . '%')
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    });
            }
        })
        ->with(['mahasiswa.user']) // Relasi ke mahasiswa dan user
        ->paginate(10);

    // Tambahkan query parameter untuk paginasi
    $mahasiswa->appends(['q' => request()->q]);

        return inertia('My/Dosen/Harian/KelasHarian/Show', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function updateEnroll(Request $request, $uuid)
    {
        $kelas = KelasHarian::where('uuid', $uuid)->firstOrFail();

        $validatedData = $request->validate([
            'kode_enroll' => 'nullable|string|unique:kelas_harians,kode_enroll,' . $uuid . ',uuid',
        ]);

        if (empty($validatedData['kode_enroll'])) {
            do {
                $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                $validatedData['kode_enroll'] = substr(str_shuffle(str_repeat($characters, 7)), 0, 7);
            } while (KelasHarian::where('kode_enroll', $validatedData['kode_enroll'])->exists());
        }
        
        $kelas->update($validatedData);

        return redirect()->route('dsn.dh.kelas.index');
    }

    public function updateJamDur(Request $request, $uuid)
    {
        $kelas = KelasHarian::where('uuid', $uuid)->firstOrFail();

        // Validasi input jam_mulai dan jam_selesai
        $validatedData = $request->validate([
            'jam_mulai' => 'required|date_format:H:i', // Format jam mulai: HH:MM
            'durasi' => 'required|integer|min:1', // Format jam selesai: HH:MM
        ]);

        $kelas->update([
            'jam_mulai' => $validatedData['jam_mulai'],
            'durasi' => $validatedData['durasi'],
        ]);

        return redirect()->route('dsn.dh.kelas.index')->with('success', 'Jam mulai dan durasi berhasil diupdate.');
    }

    public function viewMhs($uuidMhs)
    {
        $mahasiswa = Mahasiswa::with('user')->where('uuid', $uuidMhs)->firstOrFail();
        $angkatans = Angkatan::all();
        $prodis = Prodi::all();

        return inertia('My/Mahasiswa/Profil/Index', [
            'mahasiswa' => $mahasiswa,
            'angkatans' => $angkatans,
            'prodis' => $prodis,
            'title' => 'Profil Mahasiswa',
        ]);
    }

}
