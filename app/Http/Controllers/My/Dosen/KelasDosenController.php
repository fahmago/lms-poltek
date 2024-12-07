<?php

namespace App\Http\Controllers\My\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Kelas;
use App\Models\Mahasiswa;
use App\Models\PilihKelas;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class KelasDosenController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount('pilihKelas')->when(request()->q, function($kelas) {
            $search = request()->q;
            $kelas = $kelas->where(function ($query) use ($search) {
                $query->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas', 'like', '%' . $search . '%')
                        ->orWhereHas('matkul', function($q3) use ($search) {
                            $q3->where('nama_matkul', 'like', '%' . $search . '%');
                        });
            });
        })->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->with(['dosen.user', 'matkul'])->paginate(10);

        $kelas->appends(['q' => request()->q]);

        return inertia('My/Dosen/Kelas/Index', [
            'kelas' => $kelas,
        ]);        
    }

    public function show($uuidKelas)
    {
        $kelas = Kelas::where('uuid', $uuidKelas)
        ->with([
            'matkul',
            'dosen',
            'pilihKelas.mahasiswa.user',
        ])
        ->firstOrFail();

    // Pencarian dan paginasi mahasiswa
    $mahasiswa = PilihKelas::where('kode_kelas', $kelas->kode_kelas)
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

        return inertia('My/Dosen/Kelas/Show2', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
        ]);
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

    public function update(Request $request, $uuid)
    {
        $kelas = Kelas::where('uuid', $uuid)->firstOrFail();

        $validatedData = $request->validate([
            'kode_enroll' => 'nullable|string|unique:kelas,kode_enroll,' . $uuid . ',uuid',
        ]);

        if (empty($validatedData['kode_enroll'])) {
            do {
                $validatedData['kode_enroll'] = Str::random(7);
            } while (Kelas::where('kode_enroll', $validatedData['kode_enroll'])->exists());
        }
        
        $kelas->update($validatedData);

        return redirect()->route('dsn.kelas.index');
    }

}
