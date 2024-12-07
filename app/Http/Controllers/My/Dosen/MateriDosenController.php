<?php

namespace App\Http\Controllers\My\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MateriDosenController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount(['materis'])->when(request()->q, function($kelas) {
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

        return inertia('My/Dosen/Materi/Index', [
            'kelas' => $kelas,
        ]);       
    }

    public function showV1($uuid)
    {
        // $kelas = Kelas::where('uuid', $uuid)->with('materis')->firstOrFail();
        $kelas = Kelas::with('matkul')->where('uuid', $uuid)->firstOrFail();

        // Paginasi untuk materi
        $materis = $kelas->materis()->paginate(10);

        return inertia('My/Dosen/Materi/Show', [
            'kelas' => $kelas,
            'materis' => $materis
        ]);
    }

    public function show($uuid)
    {
        $dosen = Auth::user()->dosen;

        $kelas = Kelas::with('matkul')
            ->where('uuid', $uuid)
            ->where('dosen_id', $dosen->id)
            ->firstOrFail();

        return inertia('My/Dosen/Materi/Show', [
            'kelas' => $kelas,
            'materis' => $kelas->materis()->paginate(10),
        ]);
    }


    public function create()
    {
        $kelas = Kelas::with(['matkul'])->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->get();
        return inertia('My/Dosen/Materi/Create', [
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_kelas' => 'required|exists:kelas,kode_kelas',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'file' => 'nullable|url|max:255',
        ],[
            'kode_kelas.exists' => 'Kelas tidak ditemukan',
            'file.url' => 'File harus berupa URL',
        ]);

        $dosen = Auth::user()->dosen;
        if(!$dosen) {
            return back()->withErrors(['dosen' => 'Data dosen tidak ditemukan untuk user ini.']);
        }

        $validated['dosen_id'] = $dosen->id;
        $validated['tanggal_dibuat'] = now();

        Materi::create($validated); 

        return redirect()->route('dsn.materi.index');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'file' => 'nullable|url',
        ]);

        $materi = Materi::where('uuid', $uuid)->firstOrFail();

        // $validated['deskripsi'] = $validated['deskripsi'] ?? $materi->deskripsi;
        // $validated['file'] = $validated['file'] ?? $materi->file;
        $materi->update($validated);

        return redirect()->back();
    }

    public function destroy($uuid)
    {
        $materi = Materi::where('uuid', $uuid)->firstOrFail();
        $materi->delete();
        return redirect()->back();
    }

}
