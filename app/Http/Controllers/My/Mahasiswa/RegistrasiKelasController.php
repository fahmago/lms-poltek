<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\KelasHarianMahasiswa;
use App\Models\Kelas;
use App\Models\PilihKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RegistrasiKelasController extends Controller
{
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

    public function joinClass1()
    {
        $mahasiswa = Auth::user()->mahasiswa;

        $kelas = KelasHarian::with(['dosen.user'])->get()->makeHidden(['kode_enroll']);

        $kelasTerpilih = $mahasiswa->kelasHarians()
                                    ->select('kelas_harian_mahasiswas.kelas_harian_id') 
                                    ->pluck('kelas_harian_mahasiswas.kelas_harian_id')
                                    ->toArray();

        return inertia('My/Mahasiswa/Registrasi/Join/Index', [
            'kelas' => $kelas,
            'kelasTerpilih' => $kelasTerpilih,
        ]);
    }

    public function joinClass()
    {
        $mahasiswa = Auth::user()->mahasiswa;
        
        // Ambil tahun saat ini
        $tahunSaatIni = date('Y');

        // Tambahkan where('tahun', $tahunSaatIni)
        $kelas = KelasHarian::with(['dosen.user'])
            ->where('tahun', $tahunSaatIni) // <--- Filter Tahun
            ->orderBy('semester', 'asc')
            ->orderBy('nama_kelas', 'asc')  // Opsional: Biar urut abjad
            ->get()
            ->makeHidden(['kode_enroll']);

        $kelasTerpilih = $mahasiswa->kelasHarians()
            ->select('kelas_harian_mahasiswas.kelas_harian_id')
            ->pluck('kelas_harian_mahasiswas.kelas_harian_id')
            ->toArray();

        return inertia('My/Mahasiswa/Registrasi/Join/Index', [
            'kelas' => $kelas,
            'kelasTerpilih' => $kelasTerpilih,
        ]);
    }

    public function joinStore(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'id' => [
                'required',
                Rule::exists('kelas_harians', 'id')->where(function ($query) use ($request) {
                    $query->where('kode_enroll', $request->kode_enroll);
                }),
            ],
            'kode_enroll' => 'required|exists:kelas_harians,kode_enroll',
        ]);

        // return "Ada";

        $kelas = KelasHarian::where('id', $request->id)
                ->where('kode_enroll', $request->kode_enroll)
                ->first();

        KelasHarianMahasiswa::create([
            'mahasiswa_id' => Auth::user()->mahasiswa->id,
            'kelas_harian_id' => $kelas->id, 
        ]);

        // return redirect()->route('mhs.join.index')->with('success', "Anda Berhasil Join ke Kelas $kelas->nama_kelas");
        return redirect()->route('mhs.dh.kls.index')->with('success', "Anda Berhasil Join ke Kelas $kelas->nama_kelas");

    }
}
