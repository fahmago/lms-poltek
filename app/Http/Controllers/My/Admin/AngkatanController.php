<?php

namespace App\Http\Controllers\My\Admin;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use Illuminate\Http\Request;

class AngkatanController extends Controller
{
    public function index()
    {
        $angkatans = Angkatan::withCount('mahasiswas')->when(request()->q, function($angkatans) {
            $search = request()->q;
            $angkatans = $angkatans->where(function ($query) use ($search) {
                $query->where('kode_tahun', 'like', '%' . $search . '%')
                        ->orWhere('nama_angkatan', 'like', '%' . $search . '%')
                        ->orWhere('ketua_angkatan', 'like', '%' . $search . '%')
                        ->orWhere('tahun_angkatan', 'like', '%' . $search . '%');
            });
        })->paginate(10);

        $angkatans->appends(['q' => request()->q]);

        // $angkatans = QueryHelper::applySearchAndPagination(
        //     Angkatan::query()->withCount('mahasiswas'), // Base query
        //     ['kode_tahun', 'nama_angkatan', 'ketua_angkatan', 'tahun_angkatan'], // Searchable fields
        //     [], // No relation
        //     request()->q // Search keyword
        // );

        return inertia('My/Admin/Angkatan/Index', [
            'angkatans' => $angkatans
        ]);
    }

    public function create()
    {
        return inertia('My/Admin/Angkatan/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_angkatan'  => 'required|string|max:255',
            'ketua_angkatan' => 'required|string|max:255',
            'tahun_angkatan' => 'required|integer|digits:4|unique:angkatans', 
        ]);

        Angkatan::create([
            'kode_tahun'     => $request->tahun_angkatan,
            'nama_angkatan'  => $request->nama_angkatan,
            'ketua_angkatan' => $request->ketua_angkatan,
            'tahun_angkatan' => $request->tahun_angkatan,
        ]);
        
        return redirect()->route('my.angkatans.index');
    }

    public function edit($uuid)
    {
        $angkatan = Angkatan::where('uuid', $uuid)->firstOrFail();
        return inertia('My/Admin/Angkatan/Edit', [
            'angkatan' => $angkatan, 
        ]);
    }

    public function update(Request $request, $uuid)
    {
         // $angkatan = Angkatan::findOrFail($id);
        $angkatan = Angkatan::where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'nama_angkatan'  => 'required|string|max:255',
            'ketua_angkatan' => 'required|string|max:255',
            'tahun_angkatan' => 'required|integer|digits:4|unique:angkatans,tahun_angkatan,' . $angkatan->id,
        ]);

        $angkatan->update([
            'kode_tahun'     => $request->tahun_angkatan,
            'nama_angkatan'  => $request->nama_angkatan,
            'ketua_angkatan' => $request->ketua_angkatan,
            'tahun_angkatan' => $request->tahun_angkatan,
        ]);

        return redirect()->route('my.angkatans.index');
    }

    public function destroy($uuid)
    {
        $angkatan = Angkatan::where('uuid', $uuid)->firstOrFail();
        $angkatan->delete();
        return redirect()->route('my.angkatans.index');
    }
}
