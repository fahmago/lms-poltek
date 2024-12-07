<?php

namespace App\Http\Controllers\My\Admin;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Matkul;
use App\Models\Prodi;
use Illuminate\Http\Request;

class ProdiController extends Controller
{
    public function index()
    {
        $prodis = Prodi::withCount(['mahasiswas', 'dosens', 'matkuls'])->when(request()->q, function($prodis) {
            $search = request()->q;
            $prodis = $prodis->where(function ($query) use ($search) {
                $query->where('kode_prodi', 'like', '%' . $search . '%')
                        ->orWhere('nama_prodi', 'like', '%' . $search . '%');
            });
        })->paginate(10);

        $prodis->appends(['q' => request()->q]);

        // $prodis = QueryHelper::applySearchAndPagination(
        //     Prodi::query()->withCount('mahasiswas'), // Base query
        //     ['kode_prodi', 'nama_prodi'], // Searchable fields
        //     [], // No relation
        //     request()->q // Search keyword
        // );

        return inertia('My/Admin/Prodi/Index', [
            'prodis' => $prodis
        ]);
    }

    public function create()
    {
        return inertia('My/Admin/Prodi/Create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'kode_prodi' => 'required|string|max:10|unique:prodis,kode_prodi',
            'nama_prodi' => 'required|string|max:255',
        ]);

        Prodi::create($validatedData);

        return redirect()->route('my.prodis.index');
    }

    public function edit($uuid)
    {
        $prodi = Prodi::where('uuid', $uuid)->firstOrFail();
        return inertia('My/Admin/Prodi/Edit', [
            'prodi' => $prodi
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $prodi = Prodi::where('uuid', $uuid)->firstOrFail();

        $validatedData = $request->validate([
            'kode_prodi' => 'required|string|max:10|unique:prodis,kode_prodi,' . $prodi->id,
            'nama_prodi' => 'required|string|max:255',
        ]);

        Dosen::where('kode_prodi', $prodi->kode_prodi)
                ->update(['kode_prodi' => $validatedData['kode_prodi']]);

        Mahasiswa::where('kode_prodi', $prodi->kode_prodi)
                ->update(['kode_prodi' => $validatedData['kode_prodi']]);

        Matkul::where('kode_prodi', $prodi->kode_prodi)
                ->update(['kode_prodi' => $validatedData['kode_prodi']]);

        $prodi->update($validatedData);

        return redirect()->route('my.prodis.index');
    }

    public function destroy($uuid)
    {
        // Belum ditambahkan ketika prodi di hapus maka mahasiswa di prodi ini juga terhapus (Jangan Lakukan Ini)
        $prodi = Prodi::where('uuid', $uuid)->firstOrFail();
        $prodi->delete();
        return redirect()->route('my.prodis.index');
    }
}
