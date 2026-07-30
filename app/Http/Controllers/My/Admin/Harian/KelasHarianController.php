<?php

namespace App\Http\Controllers\My\Admin\Harian;

use App\Exports\AbsensiKelasHarianExport;
use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Dosen;
use App\Models\Harian\KategoriKelasHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\KelasHarianMahasiswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class KelasHarianController extends Controller
{
    // public function index()
    // {
    //     $kelasHarian = KelasHarian::when(request()->q, function ($kelasHarian) {
    //         $search = request()->q;
    //         $kelasHarian = $kelasHarian->where(function ($query) use ($search) {
    //             $query->where('nama_kelas', 'like', '%' . $search . '%')
    //                 ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%')
    //                 ->orWhereHas('dosen.user', function ($q2) use ($search) {
    //                     $q2->where('name', 'like', '%' . $search . '%');
    //                 })
    //                 ->orWhereHas('kategoriKelasHarian', function ($q3) use ($search) {
    //                     $q3->where('nama_kategori', 'like', '%' . $search . '%');
    //                 });
    //         });
    //     })
    //     ->with(['dosen.user', 'kategoriKelasHarian'])
    //     ->withCount('kelasHarianMahasiswas')
    //     ->paginate(10);

    //     $kelasHarian->appends(['q' => request()->q]);

    //     return inertia('My/Admin/Harian/KelasHarian/Index2', [
    //         'kelas' => $kelasHarian,
    //     ]);
    // }
    public function index()
    {
        $currentYear = now()->year;
        $kelasHarian = KelasHarian::when(request()->q, function ($query) {
            $search = request()->q;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kelas', 'like', "%{$search}%")
                    ->orWhere('kode_kelas_harian', 'like', "%{$search}%")
                    ->orWhereHas('dosen.user', fn($q2) => $q2->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('kategoriKelasHarian', fn($q3) => $q3->where('nama_kategori', 'like', "%{$search}%"));
            });
        })
            // ->when(request()->tahun, fn($q) => $q->where('tahun', request()->tahun))
            ->when(request()->has('tahun'), function ($q) use ($currentYear) {
                if (request('tahun') === null) {
                    return;
                }
                if (request('tahun') !== '') {
                    $q->where('tahun', request('tahun'));
                } else {
                    $q->where('tahun', $currentYear);
                }
            }, function ($q) use ($currentYear) {
                $q->where('tahun', $currentYear);
            })
            ->when(request()->semester, fn($q) => $q->where('semester', request()->semester))
            ->when(request()->kategori, function ($q) {
                $kategoriUuid = request()->kategori;
                $kategoriId = KategoriKelasHarian::where('uuid', $kategoriUuid)->value('id');
                if ($kategoriId) {
                    $q->where('kategori_kelas_harian_id', $kategoriId);
                }
            })
            ->with(['dosen.user', 'kategoriKelasHarian'])
            ->withCount('kelasHarianMahasiswas')
            ->orderByDesc('tahun')
            ->orderByDesc('semester')
            ->orderBy('nama_kelas')
            ->paginate(15);

        $kelasHarian->appends(request()->only(['q', 'tahun', 'semester', 'kategori']));

        // Ambil data filter (dropdown)
        $kategoriList = KategoriKelasHarian::select('uuid', 'nama_kategori')->get();
        $tahunList = Angkatan::orderBy('tahun_angkatan', 'desc')->pluck('kode_tahun');
        $semesterList = range(1, 8);

        $filters = request()->only(['q', 'tahun', 'semester', 'kategori']);
        $filters['tahun'] = (string) ($filters['tahun'] ?? $currentYear);

        return inertia('My/Admin/Harian/KelasHarian/Index3', [
            'kelas' => $kelasHarian,
            'kategoriList' => $kategoriList,
            'tahunList' => $tahunList,
            'semesterList' => $semesterList,
            // 'filters' => request()->only(['q', 'tahun', 'semester', 'kategori']),
            'filters' => $filters,
        ]);
    }


    public function create()
    {
        return inertia('My/Admin/Harian/KelasHarian/Create', [
            'dosens' => Dosen::with('user')->get(),
            // 'angkatans' => Angkatan::all(), 
            'angkatans' => Angkatan::orderBy('tahun_angkatan', 'desc')->get(),
            'kategoriKelasHarians' => KategoriKelasHarian::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dosen_id' => 'required|exists:dosens,id', // Pastikan dosen_id ada di tabel dosens
            'nama_kelas' => 'required|string|max:255',
            'tahun' => 'required|string|exists:angkatans,kode_tahun',
            'jam_mulai' => 'required|date_format:H:i', // Validasi format 24 jam
            'durasi' => 'required|integer|min:1', // Minimal 1 menit
            'semester' => 'required|integer|between:1,8',
            'kategori_kelas_harian_id' => 'required|exists:kategori_kelas_harians,id',
        ]);

        KelasHarian::create($validated);

        // return redirect()->route('my.dh.kelas.index');
        return redirect()->route('my.dh.kelas.index')->with('success', 'Kelas Harian berhasil ditambahkan.');
    }

    public function edit($uuid)
    {
        $kelas = KelasHarian::where('uuid', $uuid)->firstOrFail();
        $dosens = Dosen::with('user')->get();
        $angkatans = Angkatan::all();
        $kategoriKelasHarians = KategoriKelasHarian::all();
        session(['previous_url' => url()->previous()]);
        return inertia('My/Admin/Harian/KelasHarian/Edit', [
            'kelas' => $kelas,
            'dosens' => $dosens,
            'angkatans' => $angkatans,
            'kategoriKelasHarians' => $kategoriKelasHarians,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validasi data yang diterima dari form
        $validatedData = $request->validate([
            'dosen_id' => 'required|exists:dosens,id',
            'nama_kelas' => 'required|string|max:255',
            'tahun' => 'required|string|exists:angkatans,kode_tahun',
            'jam_mulai' => 'required|date_format:H:i', // format jam 24
            'durasi' => 'required|integer|min:1',
            'semester' => 'required|integer|between:1,8',
            'kategori_kelas_harian_id' => 'required|exists:kategori_kelas_harians,id',
        ]);

        $kelas = KelasHarian::findOrFail($id);

        $kelas->update([
            'dosen_id' => $validatedData['dosen_id'],
            'nama_kelas' => $validatedData['nama_kelas'],
            'tahun' => $validatedData['tahun'],
            'jam_mulai' => $validatedData['jam_mulai'],
            'durasi' => $validatedData['durasi'],
            'semester' => $validatedData['semester'],
            'kategori_kelas_harian_id' => $validatedData['kategori_kelas_harian_id'],
        ]);

        // Mengembalikan response sukses
        // return redirect()->route('my.dh.kelas.index')->with('success', 'Kelas berhasil diupdate!');
        // return redirect()->route('my.dh.kelas.index')->with('success', 'Kelas berhasil diupdate!');
        return redirect(session('previous_url'));
    }
    public function printAbsensiKelas($uuid, $month)
    {
        $year = substr($month, 0, 4);  // Extract year from the month string (YYYY-MM)
        $monthNum = substr($month, 5);  // Extract month number from the month string (MM)

        // Pastikan bulan dalam format 2 digit (01 - 12)
        $bulan = \Carbon\Carbon::parse("01-$monthNum-{$year}")->format('m');  // Format to ensure it's valid month

        // Ambil data kelas bersama dengan relasi terkait
        $kelas = KelasHarian::where('uuid', $uuid)
            ->with([
                'dosen.prodi',
                'kelasHarianMahasiswas.mahasiswa.user',
                'jadwalHarians.absensiHarians'
            ])
            ->firstOrFail();

        // Ambil semua mahasiswa di kelas tersebut dan urutkan berdasarkan nama
        $mahasiswa = KelasHarianMahasiswa::where('kelas_harian_id', $kelas->id)
            ->with(['mahasiswa.user'])
            ->get()
            ->sortBy(function ($item) {
                return strtolower($item->mahasiswa->user->name);
            })
            ->values();

        // Filter jadwals berdasarkan bulan dan tahun yang dipilih
        $jadwals = $kelas->jadwalHarians
            ->filter(function ($jadwal) use ($year, $bulan) {
                $date = Carbon::parse($jadwal->tanggal);
                return $date->year == $year && $date->month == $bulan;
            })
            ->map(function ($jadwal) {
                return [
                    'id' => $jadwal->id,
                    'tanggal' => Carbon::parse($jadwal->tanggal)->format('d-m-Y'),
                    'absensi' => $jadwal->absensiHarians->mapWithKeys(function ($absensi) {
                        return [
                            $absensi->mahasiswa_id => [
                                'id' => $absensi->id,
                                'status' => match ($absensi->status) {
                                    'hadir' => 'H',
                                    'sakit' => 'S',
                                    'izin' => 'I',
                                    default => 'A',
                                },
                            ],
                        ];
                    })->toArray(),
                ];
            })
            ->sortBy(function ($jadwal) {
                return Carbon::parse($jadwal['tanggal'])->format('Y-m-d');
            })
            ->values()
            ->toArray();

        $rMonth = Carbon::parse("01-$monthNum-$year")->translatedFormat('F');

        // Return ke view dengan data yang diperlukan
        // return view('prints.absensihariannowatermark', [  // Menggunakan view cetak tanpa watermark
        return view('prints.absensiharian', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
            'jadwals' => $jadwals,
            'month' => $month,
            'title' => sprintf("Rekap_Absensi_Kelas_%s_%s_%s", $kelas->nama_kelas, $rMonth, $year),
        ]);
    }


    public function destroy($uuid)
    {
        $kelas = KelasHarian::where('uuid', $uuid)->firstOrFail();
        $kelas->delete();
        return redirect()->route('my.dh.kelas.index');
    }

    public function exportAbsensiKelas($uuid, $month)
    {
        $year = substr($month, 0, 4);
        $monthNum = substr($month, 5);

        $bulan = Carbon::parse("01-$monthNum-$year")->format('m');

        $kelas = KelasHarian::where('uuid', $uuid)
            ->with(['dosen.prodi', 'kelasHarianMahasiswas.mahasiswa.user', 'jadwalHarians.absensiHarians'])
            ->firstOrFail();

        $mahasiswa = KelasHarianMahasiswa::where('kelas_harian_id', $kelas->id)
            ->with(['mahasiswa.user'])
            ->get()
            ->sortBy(fn($item) => strtolower($item->mahasiswa->user->name))
            ->values();

        $jadwals = $kelas->jadwalHarians
            ->filter(fn($jadwal) => Carbon::parse($jadwal->tanggal)->year == $year && Carbon::parse($jadwal->tanggal)->month == $bulan)
            ->map(fn($jadwal) => [
                'id' => $jadwal->id,
                'tanggal' => Carbon::parse($jadwal->tanggal)->format('d-m-Y'),
                'absensi' => $jadwal->absensiHarians->mapWithKeys(fn($absensi) => [
                    $absensi->mahasiswa_id => ['status' => match ($absensi->status) {
                        'hadir' => 'H',
                        'sakit' => 'S',
                        'izin' => 'I',
                        default => 'A',
                    }]
                ])->toArray(),
            ])
            ->sortBy(fn($jadwal) => Carbon::parse($jadwal['tanggal'])->format('Y-m-d'))
            ->values()
            ->toArray();

        $rMonth = Carbon::parse("01-$monthNum-$year")->translatedFormat('F');
        $fileName = sprintf("Rekap_Absensi_Kelas_%s_%s_%s.xlsx", $kelas->nama_kelas, $rMonth, $year);
        return Excel::download(new AbsensiKelasHarianExport($kelas, $mahasiswa, $jadwals, $month), $fileName);
    }
}
