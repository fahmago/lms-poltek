<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbsensiMahasiswaController extends Controller
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

        $kelas = $mahasiswa->kelas()
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

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends(['q' => $request->q]);

        return inertia('My/Mahasiswa/Absensi/Index', [
            'kelas' => $kelas, 
        ]);
    }

    public function showPresence($kode_kelas)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }

        $kelas = $mahasiswa->kelas()
            ->with(['jadwals.absensis', 'matkul'])
            ->where('kelas.kode_kelas', $kode_kelas)
            ->first();

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        // $jadwals = $kelas->jadwals()->with('absensis') ->paginate(16);
        $jadwals = $kelas->jadwals()->with(['absensis' => function ($query) use ($mahasiswa) {
            $query->where('mahasiswa_id', $mahasiswa->id);  // Pastikan hanya absensi untuk mahasiswa yang login
        }])->paginate(16);

        return inertia('My/Mahasiswa/Absensi/ShowPresence', [
            'kelas' => $kelas,
            'jadwals' => $jadwals,
            // 'jadwals' => $kelas->jadwals()->paginate(16),            
        ]);
    }

    public function doPresence(Request $request)
    {
        $validated = $request->validate([
            'kode_kelas' => 'required|exists:kelas,kode_kelas',
            'jadwal_id'  => 'required|exists:jadwals,id',
            'status'     => 'required|string', // Hadir, Izin, Sakit, etc.
        ]);

        Absensi::create([
            'mahasiswa_id'  => Auth::user()->mahasiswa->id,
            'jadwal_id'     => $validated['jadwal_id'],
            'kode_kelas'    => $validated['kode_kelas'],
            'waktu_absensi' => now(),
            'status'        => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Presensi berhasil direkam.');
    }


    public function showPresence2($kode_kelas)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json(['success' => false, 'message' => 'Mahasiswa tidak ditemukan untuk user yang login'], 404);
        }

        $kelas = $mahasiswa->kelas()
            ->with('jadwals')
            ->where('kelas.kode_kelas', $kode_kelas)
            ->first();

        if (!$kelas) {
            return response()->json(['success' => false, 'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'], 404);
        }

        return inertia('My/Mahasiswa/Absensi/ShowPresence', [
            'kelas' => $kelas,
            'jadwals' => $kelas->jadwals,
        ]);

    }
    
}
