<?php

namespace App\Http\Controllers\My\Dosen\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\MateriHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MateriHarianDosenController extends Controller
{
    public function index()
    {
        $kelasHarians = KelasHarian::withCount(['materiHarians'])->when(request()->q, function($kelasHarians) {
            $search = request()->q;
            $kelasHarians = $kelasHarians->where(function ($query) use ($search) {
                $query->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
            });
        })->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->with(['dosen.user'])->paginate(10);

        $kelasHarians->appends(['q' => request()->q]);

        return inertia('My/Dosen/Harian/MateriHarian/Index', [
            'kelas' => $kelasHarians,
        ]);       
    }

    public function show($uuid)
    {
        $dosen = Auth::user()->dosen;

        $kelas = KelasHarian::with('materiHarians')
            ->where('uuid', $uuid)
            ->where('dosen_id', $dosen->id)
            ->firstOrFail();

        return inertia('My/Dosen/Harian/MateriHarian/Show', [
            'kelas' => $kelas,
            'materis' => $kelas->materiHarians()->paginate(10),
        ]);
    }

    public function create()
    {
        $kelas = KelasHarian::with(['materiHarians'])->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->get();
        return inertia('My/Dosen/Harian/MateriHarian/Create', [
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_kelas_harian' => 'required|exists:kelas_harians,kode_kelas_harian',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'file' => 'nullable|url|max:255',
        ],[
            'kode_kelas_harian.exists' => 'Kelas tidak ditemukan',
            'file.url' => 'File harus berupa URL',
        ]);

        $dosen = Auth::user()->dosen;
        if(!$dosen) {
            return back()->withErrors(['dosen' => 'Data dosen tidak ditemukan untuk user ini.']);
        }

        $validated['dosen_id'] = $dosen->id;
        $validated['tanggal_dibuat'] = now();

        MateriHarian::create($validated); 

        return redirect()->route('dsn.dh.materi.index');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'file' => 'nullable|url',
        ]);

        $materi = MateriHarian::where('uuid', $uuid)->firstOrFail();

        // $validated['deskripsi'] = $validated['deskripsi'] ?? $materi->deskripsi;
        // $validated['file'] = $validated['file'] ?? $materi->file;
        $materi->update($validated);

        return redirect()->back();
    }

    public function destroy($uuid)
    {
        $materi = MateriHarian::where('uuid', $uuid)->firstOrFail();
        $materi->delete();
        return redirect()->back();
    }
}
