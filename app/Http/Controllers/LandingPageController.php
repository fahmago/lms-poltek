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
}
