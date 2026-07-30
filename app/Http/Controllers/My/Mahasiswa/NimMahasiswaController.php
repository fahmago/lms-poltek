<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class NimMahasiswaController extends Controller
{
    public function index()
    {
        return inertia('My/Mahasiswa/Nim/Index2');
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // $request->validate([
        //     'nim' => 'required|string|unique:mahasiswas,nim,' . $user->mahasiswa->id,
        //     'password' => 'required|string',
        // ]);

        $request->validate([
            'nim' => [
                'required',
                'digits:12', // 🔥 angka semua & tepat 12 digit
                'unique:mahasiswas,nim,' . $user->mahasiswa->id,
            ],
            'password' => ['required'],
        ], [
            'nim.required' => 'NIM wajib diisi.',
            'nim.digits' => 'NIM harus berupa 12 digit angka.',
            'nim.unique' => 'NIM sudah digunakan oleh mahasiswa lain.',
            'password.required' => 'Password wajib diisi.',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'Password tidak sesuai.']);
        }

        $user->mahasiswa->update(['nim' => $request->nim]);

        // return back()->with('success', 'NIM berhasil diperbarui.');
        return redirect()->route('mhs.profil.index')->with('success', 'NIM berhasil diperbarui.');
    }
}
