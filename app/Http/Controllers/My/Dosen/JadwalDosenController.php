<?php

namespace App\Http\Controllers\My\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\PilihKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class JadwalDosenController extends Controller
{
    public function index(Request $request)
    {
        $dosen = Auth::user()->dosen;
        $kelas = $dosen->kelas()
            ->withCount('jadwals')
            ->with('matkul', 'dosen.user') 
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas.nama_kelas', 'like', '%' . $search . '%') 
                            ->orWhere('kelas.kode_kelas', 'like', '%' . $search . '%') 
                            ->orWhereHas('matkul', function ($q) use ($search) {
                                $q->where('nama_matkul', 'like', '%' . $search . '%');
                            });
                });
            })->paginate(10);

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends(['q' => $request->q]);

        return inertia('My/Dosen/Jadwal/Index', [
            'kelas' => $kelas, 
        ]);
    }

    public function show($kode_kelas)
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            return response()->json([
                'success' => false,
                'message' => 'Dosen tidak ditemukan untuk user yang login'
            ], 404);
        }

        $kelas = $dosen->kelas()
            ->with(['jadwals', 'matkul'])
            ->where('kelas.kode_kelas', $kode_kelas)
            ->first();

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        return inertia('My/Dosen/Jadwal/Show', [
            'kelas' => $kelas,
            'jadwals' => $kelas->jadwals()->paginate(16),
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
        ]);
    
        $jadwal = Jadwal::where('uuid', $uuid)->firstOrFail();
    
        $jamMulai = Carbon::parse($validated['jam_mulai']);
        $jamSelesai = $jamMulai->addHours($request->sks);
    
        $jadwal->update([
            'tanggal' => $validated['tanggal'],
            'jam_mulai' => $validated['jam_mulai'],
            'jam_selesai' => $jamSelesai->format('H:i'),
        ]);
    
        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui ke ' . $validated['tanggal'] . ' ' . $validated['jam_mulai']);
    }

    public function absenMhsV1($uuidKelas)
    {
        $kelas = Kelas::where('uuid', $uuidKelas)
        ->with([
            'matkul',
            'dosen',
            'pilihKelas.mahasiswa.user',
        ])
        ->firstOrFail();

        $mahasiswa = PilihKelas::where('kode_kelas', $kelas->kode_kelas)
            ->with(['mahasiswa.user'])
            ->get();

        return inertia('My/Dosen/Jadwal/Absen', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function absenMhsV2($uuidKelas)
    {
        $kelas = Kelas::where('uuid', $uuidKelas)
            ->with([
                'matkul',
                'dosen',
                'pilihKelas.mahasiswa.user',
                'jadwals.absensis' // Relasi jadwal dan absensi
            ])
            ->firstOrFail();

        $mahasiswa = PilihKelas::where('kode_kelas', $kelas->kode_kelas)
            ->with(['mahasiswa.user'])
            ->get();

        $mahasiswa = $mahasiswa->sortBy(function ($item) {
            return $item->mahasiswa->user->name; // Menggunakan nama mahasiswa yang ada pada relasi 'user'
        });

        // $jadwals = $kelas->jadwals->map(function ($jadwal) use ($kelas) {
        //     return [
        //         'id' => $jadwal->id,
        //         'tanggal' => $jadwal->tanggal,
        //         'absensi' => $jadwal->absensis->mapWithKeys(function ($absensi) {
        //             return [$absensi->mahasiswa_id => $absensi->status];
        //         }),
        //     ];
        // });

        $jadwals = $kelas->jadwals->map(function ($jadwal) use ($kelas) {
            return [
                'id' => $jadwal->id,
                'tanggal' => $jadwal->tanggal,
                'absensi' => $jadwal->absensis->mapWithKeys(function ($absensi) {
                    return [
                        $absensi->mahasiswa_id => match ($absensi->status) {
                            'hadir' => 'H',
                            'sakit' => 'S',
                            'izin' => 'I',
                            default => 'A',
                        },
                    ];
                }),
            ];
        });
        
        
        return inertia('My/Dosen/Jadwal/Absen2', [
                'kelas' => $kelas,
                'mahasiswa' => $mahasiswa,
                'jadwals' => $jadwals,
            ]);
    }
        
        // return view('prints.absensi', compact('kelas', 'mahasiswa', 'jadwals'));

    public function absenMhs($uuidKelas)
    {
        $kelas = Kelas::where('uuid', $uuidKelas)
            ->with([
                'matkul',
                'dosen',
                'pilihKelas.mahasiswa.user',
                'jadwals.absensis' // Relasi jadwal dan absensi
            ])
            ->firstOrFail();
    
        // $mahasiswa = PilihKelas::where('kode_kelas', $kelas->kode_kelas)
        //     ->with(['mahasiswa.user'])
        //     ->get();
        $mahasiswa = PilihKelas::where('kode_kelas', $kelas->kode_kelas)
                ->with(['mahasiswa.user'])
                ->get()
                ->sortBy(function ($item) {
                    return strtolower($item->mahasiswa->user->name);
                })->values();
    
        $jadwals = $kelas->jadwals->map(function ($jadwal) use ($kelas) {
            return [
                'id' => $jadwal->id,
                'tanggal' => Carbon::parse($jadwal->tanggal)->format('d-m-Y'),
                // 'tanggal' => $jadwal->tanggal,
                'absensi' => $jadwal->absensis->mapWithKeys(function ($absensi) {
                    return [
                        $absensi->mahasiswa_id => [
                            'id' => $absensi->id, // Tambahkan absensi_id
                            'status' => match ($absensi->status) {
                                'hadir' => 'H',
                                'sakit' => 'S',
                                'izin' => 'I',
                                default => 'A',
                            },
                        ],
                        // $absensi->mahasiswa_id => match ($absensi->status) {
                        //     'hadir' => 'H',
                        //     'sakit' => 'S',
                        //     'izin' => 'I',
                        //     default => 'A', // Default "Alpha" jika tidak hadir
                        // },
                    ];
                }),
            ];
        });
            
    
        return inertia('My/Dosen/Jadwal/Absen3', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
            'jadwals' => $jadwals,
        ]);
    }

    public function updateAbsensi(Request $request)
    {
        // Mapping status frontend ke status yang disimpan di database
        $statusMapping = [
            'H' => 'hadir',
            'I' => 'izin',
            'S' => 'sakit',
            'A' => 'alpha',
        ];
    
        // Validasi input
        $validated = $request->validate([
            'mahasiswa_id' => 'required|exists:mahasiswas,id',
            'jadwal_id' => 'required|exists:jadwals,id',
            'kode_kelas' => 'required|exists:kelas,kode_kelas',
            'status' => 'required|string|in:H,S,I,A', // Validasi hanya menerima status dari frontend
            'absensi_id' => 'nullable|exists:absensis,id', // absensi_id bisa null
        ]);
    
        // Konversi status dari frontend ke database
        $statusToSave = $statusMapping[$validated['status']];
    
        // Jika absensi_id tidak null, lakukan update
        if ($validated['absensi_id']) {
            $absensi = Absensi::findOrFail($validated['absensi_id']);
            $absensi->update([
                'status' => $statusToSave,
            ]);
    
            return redirect()->back()->with('success', 'Absensi berhasil diperbarui.');
        } 
    
        // Jika absensi_id null, lakukan create
        $absensi = Absensi::create([
            'mahasiswa_id' => $validated['mahasiswa_id'],
            'jadwal_id' => $validated['jadwal_id'],
            'kode_kelas' => $validated['kode_kelas'],
            'waktu_absensi' => Carbon::now(),
            'status' => $statusToSave,
        ]);
        
    
        return redirect()->back()->with('success', 'Absensi berhasil disimpan.');
    }
    
}
