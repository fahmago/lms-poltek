<?php

namespace App\Http\Controllers\My\Admin;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Matkul;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::when(request()->q, function($kelas) {
            $search = request()->q;
            $kelas = $kelas->where(function ($query) use ($search) {
                $query->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas', 'like', '%' . $search . '%')
                        ->orWhereHas('dosen', function($q) use ($search) {
                            $q->where('nidn', 'like', '%' . $search . '%')
                                ->orWhere('nidn', 'like', '%' . $search . '%');
                        })->orWhereHas('dosen.user', function($q2) use ($search) {
                            $q2->where('name', 'like', '%' . $search . '%');
                        })->orWhereHas('matkul', function($q3) use ($search) {
                            $q3->where('nama_matkul', 'like', '%' . $search . '%');
                        });
            });
        })->with(['dosen.user', 'matkul'])->paginate(10);

        $kelas->appends(['q' => request()->q]);

        return inertia('My/Admin/Kelas/Index', [
            'kelas' => $kelas,
        ]);        
    }

    public function create()
    {
        $matkuls = Matkul::all();
        $angkatans = Angkatan::all();
        $dosens = Dosen::with('user')->get();
        return inertia('My/Admin/Kelas/Create', [
            'matkuls' => $matkuls,
            'dosens' => $dosens,
            'angkatans' => $angkatans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dosen_id' => 'required|exists:dosens,id',
            'kode_matkul' => 'required|exists:matkuls,kode_matkul',
            // 'kode_kelas' => 'required|unique:kelas,kode_kelas',
            'nama_kelas' => 'required|string',
            'tahun' => 'required|exists:angkatans,kode_tahun',
        ]);

        Kelas::create($validated); 

        return redirect()->route('my.kelas.index'); 
    }


    public function edit($uuid)
    {
        $kelas = Kelas::where('uuid', $uuid)->firstOrFail();
        $matkuls = Matkul::all();
        $dosens = Dosen::with('user')->get();
        $angkatans = Angkatan::all();
        return inertia('My/Admin/Kelas/Edit', [
            'matkuls' => $matkuls,
            'dosens' => $dosens,
            'kelas' => $kelas,
            'angkatans' => $angkatans
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $kelas = Kelas::where('uuid', $uuid)->firstOrFail();

        $validatedData = $request->validate([
            'dosen_id' => 'required|exists:dosens,id',
            'kode_matkul' => 'required|exists:matkuls,kode_matkul',
            'nama_kelas' => 'required|string|max:100',
            'tahun' => 'required|exists:angkatans,kode_tahun',
            'kode_enroll' => 'nullable|string|unique:kelas,kode_enroll,' . $uuid . ',uuid',
        ]);

        if (empty($validatedData['kode_enroll'])) {
            do {
                $validatedData['kode_enroll'] = Str::random(7);
            } while (Kelas::where('kode_enroll', $validatedData['kode_enroll'])->exists());
        }
        
        $kelas->update($validatedData);

        return redirect()->route('my.kelas.index');
    }


    public function destroy($uuid)
    {
        $kelas = Kelas::where('uuid', $uuid)->firstOrFail();
        $kelas->delete();
        return redirect()->route('my.kelas.index');
    }
}
