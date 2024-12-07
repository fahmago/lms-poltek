<?php

namespace App\Http\Controllers\My\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\PengumpulanTugas;
use App\Models\Tugas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TugasDosenController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount('tugas')->when(request()->q, function($kelas) {
            $search = request()->q;
            $kelas = $kelas->where(function ($query) use ($search) {
                $query->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas', 'like', '%' . $search . '%')
                        ->orWhereHas('matkul', function($q) use ($search) {
                            $q->where('nama_matkul', 'like', '%' . $search . '%');
                        });
            });
        })->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->with(['matkul'])->paginate(10);

        $kelas->appends(['q' => request()->q]);

        return inertia('My/Dosen/Tugas/Index', [
            'kelas' => $kelas
        ]);
    }

    public function showV1($uuid)
    {
        // $kelas = Kelas::where('uuid', $uuid)->with('materis')->firstOrFail();
        $kelas = Kelas::with('matkul')->where('uuid', $uuid)->firstOrFail();

        // Paginasi untuk materi
        $tugas = $kelas->tugas()->paginate(10);

        return inertia('My/Dosen/Tugas/Show', [
            'kelas' => $kelas,
            'tugas' => $tugas
        ]);
    }

    public function show($uuid)
    {
        $dosen = Auth::user()->dosen;

        $kelas = Kelas::with('matkul')
            ->where('uuid', $uuid)
            ->where('dosen_id', $dosen->id)
            ->firstOrFail();

        return inertia('My/Dosen/Tugas/Show', [
            'kelas' => $kelas,
            'tugas' => $kelas->tugas()->paginate(10),
        ]);
    }


    public function create()
    {
        $kelas = Kelas::with(['matkul'])->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->get();
        return inertia('My/Dosen/Tugas/Create', [
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_kelas' => 'required|exists:kelas,kode_kelas',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_deadline' => 'required|date_format:Y-m-d\TH:i',
            // 'tanggal_deadline' => 'required|date|after:today',
        ],[
            'kode_kelas.exists' => 'Kelas tidak ditemukan',
        ]);

        $dosen = Auth::user()->dosen;
        if(!$dosen) {
            return back()->withErrors(['dosen' => 'Data dosen tidak ditemukan untuk user ini.']);
        }        

        try {
            $validated['tanggal_diberikan'] = now();
            Tugas::create($validated); 
            return redirect()->route('dsn.tugas.index');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan tugas.')->withInput();
        }        
    }

    public function update(Request $request, $uuid)
    {
        $tugas = Tugas::where('uuid', $uuid)->firstOrFail();
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_deadline' => 'required|date_format:Y-m-d\TH:i',
            // 'tanggal_deadline' => 'required|date|after:today',
        ]);
        $tugas->update($validated);
        return redirect()->back();
    }

    public function destroy($uuid)
    {
        $tugas = Tugas::where('uuid', $uuid)->firstOrFail();
        $tugas->delete();
        return redirect()->back();
    }

    public function deleteRespon($uuid)
    {
        $tugas = PengumpulanTugas::where('uuid', $uuid)->firstOrFail();
        $tugas->delete();
        return redirect()->back();
    }

    public function responTugas($uuid)
    {
        $tugas = Tugas::where('uuid', $uuid)
                        ->with('pengumpulanTugas.mahasiswa.user', 'kelas', 'kelas.matkul')  // Eager load pengumpulanTugas dan mahasiswa
                        ->firstOrFail();

        $pengumpulanTugas = $tugas->pengumpulanTugas;

        // return $pengumpulanTugas;

        return inertia('My/Dosen/Tugas/Respon', [
            'tugas' => $tugas,  // Kirimkan tugas
            'pengumpulanTugas' => $pengumpulanTugas
        ]);
    }

    public function feedBackTugas(Request $request, $uuid)
    {
        $request->validate([
            'nilai' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);
    
        $pengumpulanTugas = PengumpulanTugas::where('uuid', $uuid)->firstOrFail();

        $pengumpulanTugas->update([
            'nilai' => $request->input('nilai'),
            'feedback' => $request->input('feedback'),
        ]);
    
        return back()->with('success', 'Data tugas berhasil diperbarui.');
    }

}
