<?php

namespace App\Http\Controllers;

use App\Models\Prodi;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    public function index()
    {
        $prodis = Prodi::all();
        return inertia('Landing/Index', [
            'prodis' => $prodis
        ]);
    }

    public function show($kode_prodi)
    {
        $prodi = Prodi::with(['matkuls' => function ($query) {
            $query->orderBy('semester');
        }])->where('kode_prodi', $kode_prodi)->firstOrFail();

        // Kelompokkan matkul berdasarkan semester
        $matkulsBySemester = $prodi->matkuls->groupBy('semester');

        // return $matkulsBySemester;

        return inertia('Landing/Show', [
            'prodi' => $prodi,
            'matkulsBySemester' => $matkulsBySemester,
        ]);
    }

}
