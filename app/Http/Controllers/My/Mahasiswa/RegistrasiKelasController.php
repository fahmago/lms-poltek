<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\PilihKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RegistrasiKelasController extends Controller
{
    public function indexV1()
    {
        $kelas = Kelas::with(['matkul', 'dosen.user'])->get();
        return inertia('My/Mahasiswa/Registrasi/Create', [
            'kelas' => $kelas,
        ]);
    }

    public function index()
    {
        $mahasiswa = Auth::user()->mahasiswa;
        $kelas = Kelas::with(['matkul', 'dosen.user'])
        ->get()
        ->makeHidden(['kode_enroll']);
        $kelasTerpilih = $mahasiswa->kelas()
            ->select('pilih_kelas.kode_kelas') 
            ->pluck('pilih_kelas.kode_kelas')
            ->toArray();

        return inertia('My/Mahasiswa/Registrasi/Index', [
            'kelas' => $kelas,
            'kelasTerpilih' => $kelasTerpilih,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'kode_kelas' => [
                'required',
                Rule::exists('kelas', 'kode_kelas')->where(function ($query) use ($request) {
                    $query->where('kode_enroll', $request->kode_enroll);
                }),
            ],
            'kode_enroll' => 'required|exists:kelas,kode_enroll',
        ]);

        $kelas = Kelas::where('kode_kelas', $request->kode_kelas)
                ->where('kode_enroll', $request->kode_enroll)
                ->first();

        PilihKelas::create([
            'mahasiswa_id' => Auth::user()->mahasiswa->id,
            'kode_kelas' => $kelas->kode_kelas, 
        ]);

        return redirect()->route('mhs.reg.index');

    }
}
