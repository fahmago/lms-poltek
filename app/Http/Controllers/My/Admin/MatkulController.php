<?php

namespace App\Http\Controllers\My\Admin;

use App\Helpers\ImageBase64;
use App\Http\Controllers\Controller;
use App\Imports\MataKuliahImport;
use App\Models\Kelas;
use App\Models\Matkul;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;

class MatkulController extends Controller
{
    public function index()
    {
        $matkuls = Matkul::when(request()->q, function($matkuls) {
            $search = request()->q;
            $matkuls = $matkuls->where(function ($query) use ($search) {
                $query->where('nama_matkul', 'like', '%' . $search . '%')
                        ->orWhere('kode_matkul', 'like', '%' . $search . '%')
                        ->orWhereHas('prodi', function($q) use ($search) {
                            $q->where('nama_prodi', 'like', '%' . $search . '%')
                                ->orWhere('kode_prodi', 'like', '%' . $search . '%');
                        });
            });
        })->with(['prodi'])->paginate(10);

        $matkuls->appends(['q' => request()->q]);

        return inertia('My/Admin/Matkul/Index', [
            'matkuls' => $matkuls,
        ]);        
    }

    public function create()
    {
        $prodis = Prodi::all();
        return inertia('My/Admin/Matkul/Create', [
            'prodis' => $prodis
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'kode_prodi'    => 'required|string|exists:prodis,kode_prodi',
            'kode_matkul'   => 'required|string|max:10|unique:matkuls,kode_matkul',
            'nama_matkul'   => 'required|string|max:255',
            'sks'           => 'required|integer|min:1|max:6',
            'semester'      => 'required|integer|min:1|max:14',
            'rps'           => 'required|string|max:255|unique:matkuls,rps',
        ]);
        Matkul::create($validatedData);
        return redirect()->route('my.matkuls.index');
    }

    public function edit($uuid)
    {
        $matkul = Matkul::where('uuid', $uuid)->firstOrFail();
        $prodis = Prodi::all();
        return inertia('My/Admin/Matkul/Edit', [
            'matkul' => $matkul,
            'prodis' => $prodis
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $matkul = Matkul::where('uuid', $uuid)->firstOrFail();
        $validatedData = $request->validate([
            'kode_prodi' => 'required|string|exists:prodis,kode_prodi',
            'kode_matkul' => "required|string|max:10|unique:matkuls,kode_matkul,{$matkul->id}",
            'nama_matkul' => 'required|string|max:255',
            'sks' => 'required|integer|min:1|max:6',
            'semester' => 'required|integer|min:1|max:14',
            'rps' => 'required|string|max:255|unique:matkuls,rps,' . $matkul->id,
        ]);

        Kelas::where('kode_matkul', $matkul->kode_matkul)
                ->update(['kode_matkul' => $validatedData['kode_matkul']]);

        $matkul->update($validatedData);

        return redirect()->route('my.matkuls.index');
    }


    public function destroy($uuid)
    {
        $matkul = Matkul::where('uuid', $uuid)->firstOrFail();

        // $matkul->kelas()->delete();
        $matkul->kelas->each(function ($kelas) {
            $kelas->delete(); // Ini akan memicu event deleting pada Kelas
        });

        $matkul->delete();

        return redirect()->route('my.matkuls.index');
    }

    public function showImportMatkulsForm()
    {
        return inertia('My/Admin/Matkul/MataKuliahImport'); 
    }

    public function importExcelMatkul(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv|max:2048', // Validasi file harus Excel/CSV
        ]);

        try {
            Excel::import(new MataKuliahImport, $request->file('file'));
            // return response()->json(['message' => 'Import berhasil!'], 200);
            return redirect()->route('my.matkuls.index');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan saat mengimport: ' . $e->getMessage()], 500);
        }
    }

}
