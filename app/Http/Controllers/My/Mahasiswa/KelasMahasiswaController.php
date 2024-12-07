<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\PilihKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KelasMahasiswaController extends Controller
{
    // public function index() {
    //     $mahasiswa = Auth::user()->mahasiswa;
    //     $kelasDenganMatkul = $mahasiswa->kelas()->with('matkul')->get();
    //     return $kelasDenganMatkul;
    //     return inertia('My/Mahasiswa/Kelas/Index', [
    //         'kelas' => $kelas,
    //     ]);      
    // }
    // public function index(Request $request) 
    // {
    //     $mahasiswa = Auth::user()->mahasiswa;

    //     $kelas = $mahasiswa->kelas()
    //         ->with('matkul', 'dosen.user') 
    //         ->when($request->q, function ($query) use ($request) {
    //             $search = $request->q;
    //             $query->where(function ($subQuery) use ($search) {
    //                 $subQuery->where('nama_kelas', 'like', '%' . $search . '%')
    //                          ->orWhere('kode_kelas', 'like', '%' . $search . '%')
    //                          ->orWhereHas('matkul', function ($q) use ($search) {
    //                              $q->where('nama_matkul', 'like', '%' . $search . '%');
    //                          });
    //             });
    //         })
    //         ->paginate(10); 
            
    //     $kelas->appends(['q' => $request->q]);

    //     return inertia('My/Mahasiswa/Kelas/Index', [
    //         'kelas' => $kelas,
    //     ]);
    // }
    public function index(Request $request) 
    {
        $mahasiswa = Auth::user()->mahasiswa;
        $kelas = $mahasiswa->kelas()
            ->with('matkul', 'dosen.user') 
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas.nama_kelas', 'like', '%' . $search . '%') 
                            ->orWhere('kelas.kode_kelas', 'like', '%' . $search . '%') 
                            ->orWhereHas('matkul', function ($q) use ($search) {
                                $q->where('nama_matkul', 'like', '%' . $search . '%');
                            });
                });
            })->paginate(10);

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends(['q' => $request->q]);

        return inertia('My/Mahasiswa/Kelas/Index', [
            'kelas' => $kelas, 
        ]);
    }

}
