<?php

namespace App\Http\Controllers\My\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfilMahasiswaController extends Controller
{
    public function index()
    {
        $mahasiswa = Mahasiswa::with('user')->where('user_id', Auth::user()->id)->firstOrFail();
        $angkatans = Angkatan::all();
        $prodis = Prodi::all();

        return inertia('My/Mahasiswa/Profil/Index', [
            'mahasiswa' => $mahasiswa,
            'angkatans' => $angkatans,
            'prodis' => $prodis,
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $mahasiswa = Mahasiswa::where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'telepon' => 'required|string|max:15|unique:mahasiswas,telepon,' . $mahasiswa->id,
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'gender' => 'required|in:L,P',
            'alasan_pilih_idn' => 'required|string',
            'image' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($mahasiswa->image) {
                Storage::disk('local')->delete('public/mahasiswa/'.basename($mahasiswa->image));
            }
            $image = $request->file('image');
            $image->storeAs('public/mahasiswa', $image->hashName());
            $validated['image'] = $image->hashName();
        }

        $validated['is_lengkap'] = true;

        $mahasiswa->update($validated);

        return redirect()->route('mhs.profil.index');
    }

}
