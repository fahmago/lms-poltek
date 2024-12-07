<?php

namespace App\Http\Controllers\My\Admin;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class MahasiswaController extends Controller
{
    public function index()
    {
        $mahasiswas = Mahasiswa::when(request()->q, function($mahasiswas) {
            $search = request()->q;
            $mahasiswas = $mahasiswas->where(function ($query) use ($search) {
                $query->where('nim', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%')
                                ->orWhere('email', 'like', '%' . $search . '%');
                        });
            });
        })->with(['user','prodi','angkatan'])->paginate(10);

        $mahasiswas->appends(['q' => request()->q]);

        // $mahasiswas = QueryHelper::applySearchAndPagination(
        //     Mahasiswa::query()->with(['user', 'prodi']), // Base query
        //     ['nim'], // Searchable fields
        //     [
        //         'user' => ['name', 'email'], // Related fields to search
        //         'prodi' => ['nama_prodi'],
        //     ],
        //     request()->q, // Search keyword
        //     5 // Per page
        // );

        return inertia('My/Admin/Mahasiswa/Index', [
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function create()
    {
        $angkatans = Angkatan::all();
        $prodis = Prodi::all();
        $roles = Role::all();

        return inertia('My/Admin/Mahasiswa/Create', [
            'angkatans' => $angkatans,
            'prodis' => $prodis,
            'roles' => $roles, 
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nim' => 'nullable|unique:mahasiswas,nim',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:4',
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'kode_tahun' => 'required|exists:angkatans,kode_tahun',
            'role' => 'required|exists:roles,name',
        ]);

        // Create the User first
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Assign role to user
        $user->assignRole($request->role); 

        // Create Mahasiswa
        Mahasiswa::create([
            'nim' => $request->nim ?? null,
            'user_id' => $user->id,
            'kode_prodi' => $request->kode_prodi,
            'kode_tahun' => $request->kode_tahun,
        ]);

        return redirect()->route('my.mahasiswas.index');
    }

    public function edit(Request $request, $uuid)
    {
        // Validasi UUID, Jika salah maka akan kembali ke halaman sebelumnya
        // $request->merge(['uuid' => $uuid])->validate([
        //     'uuid' => 'required|uuid', 
        // ]);

        $mahasiswa = Mahasiswa::with('user')->where('uuid', $uuid)->firstOrFail();
        $angkatans = Angkatan::all();
        $prodis = Prodi::all();

        return inertia('My/Admin/Mahasiswa/Edit2', [
            'mahasiswa' => $mahasiswa,
            'angkatans' => $angkatans,
            'prodis' => $prodis,
        ]);
    }

    public function update(Request $request, $uuid)
    {
        // Log::info('UUID diterima: ' . $uuid);
        // Ambil data mahasiswa berdasarkan UUID
        $mahasiswa = Mahasiswa::with('user')->where('uuid', $uuid)->firstOrFail();

        // Validasi input
        $request->validate([
            'nim' => 'nullable|unique:mahasiswas,nim,' . $mahasiswa->id, // NIM harus unik kecuali mahasiswa ini
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $mahasiswa->user_id, // Email harus unik kecuali mahasiswa ini
            'password' => 'nullable|string|min:4', // Password opsional
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'kode_tahun' => 'required|exists:angkatans,kode_tahun',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'telepon' => 'nullable|unique:mahasiswas,telepon,' . $mahasiswa->id, // Telepon harus unik kecuali mahasiswa ini
            'gender' => 'nullable|string',
            'alasan_pilih_idn' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_lengkap' => 'nullable|boolean', // Status lengkap opsional
        ]);
        
        // Update data pengguna terkait
        $user = $mahasiswa->user;
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Jika password diberikan, update password
        if ($request->filled('password')) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        }

        // Update data mahasiswa
        $mahasiswa->update([
            'nim' => $request->nim ?? $mahasiswa->nim,
            'kode_prodi' => $request->kode_prodi,
            'kode_tahun' => $request->kode_tahun,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'telepon' => $request->telepon,
            'gender' => $request->gender,
            'alasan_pilih_idn' => $request->alasan_pilih_idn,
            'is_lengkap' => $request->is_lengkap ?? 0, // Default 0 jika tidak ada
        ]);

        // Update gambar jika diberikan
        if ($request->hasFile('image')) {
            // Hapus gambar lama
            if ($mahasiswa->image) {
                Storage::disk('local')->delete('public/mahasiswa/'.basename($mahasiswa->image));
            }

            // Simpan gambar baru
            $image = $request->file('image');
            $image->storeAs('public/mahasiswa', $image->hashName());
            $mahasiswa->update([
                'image' => $image->hashName(),
            ]);
        }

        // Redirect atau kembalikan respons
        return redirect()->route('my.mahasiswas.index');
    }


    // public function update(Request $request, $id)
    // {
    //     // Ambil data mahasiswa berdasarkan ID
    //     $mahasiswa = Mahasiswa::findOrFail($id);

    //     // Validasi input dari request
    //     $validated = $request->validate([
    //         'nim' => 'nullable|unique:mahasiswas,nim,' . $id, // Jangan validasi NIM jika NIM yang sama
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:users,email,' . $mahasiswa->user_id, // Validasi email unik kecuali pada mahasiswa yang sedang diupdate
    //         'password' => 'nullable|string|min:4', // Password opsional, hanya jika ingin mengganti
    //         'kode_prodi' => 'required|exists:prodis,kode_prodi',
    //         'kode_tahun' => 'required|exists:angkatans,kode_tahun',
    //         'tempat_lahir' => 'nullable|string',
    //         'tanggal_lahir' => 'nullable|date',
    //         'telepon' => 'nullable|string',
    //         'gender' => 'nullable|string',
    //         'alasan_pilih_idn' => 'nullable|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    //         'is_lengkap' => 'nullable|boolean', // Menambahkan status lengkap
    //     ]);


    //     User::find($mahasiswa->user_id)->update([
    //         'name' => $request->name, 
    //         'email' => $request->email
    //     ]);

    //     // Update data mahasiswa dengan data validasi yang sudah diterima
    //     $mahasiswa->nim = $request->nim ?? $mahasiswa->nim;
    //     // $mahasiswa->name = $request->name;
    //     // $mahasiswa->email = $request->email;
        
    //     // Jika password tidak kosong, maka hash password baru
    //     if ($request->password) {
    //         User::find($mahasiswa->user_id)->update([
    //             'password' => bcrypt($request->password)
    //         ]);
    //     }

    //     $mahasiswa->kode_prodi = $request->kode_prodi;
    //     $mahasiswa->kode_tahun = $request->kode_tahun;
    //     $mahasiswa->tempat_lahir = $request->tempat_lahir;
    //     $mahasiswa->tanggal_lahir = $request->tanggal_lahir;
    //     $mahasiswa->telepon = $request->telepon;
    //     $mahasiswa->gender = $request->gender;
    //     $mahasiswa->alasan_pilih_idn = $request->alasan_pilih_idn;
    //     $mahasiswa->is_lengkap = $request->is_lengkap ?? 0; // Default 0 jika tidak ada

    //     if ($request->file('image')) {

    //         Storage::disk('local')->delete('public/mahasiswa/'.basename($mahasiswa->image));

    //         $image = $request->file('image');
    //         $image->storeAs('public/mahasiswa', $image->hashName());
    //         $mahasiswa->image = $image->hashName();
    //     }

    //     // Simpan perubahan
    //     $mahasiswa->save();

    //     // Setelah berhasil, kembalikan response atau redirect
    //     return redirect()->route('my.mahasiswas.index');
    // }

    public function destroy($uuid)
    {
        $mahasiswa = Mahasiswa::where('uuid', $uuid)->firstOrFail();

        Storage::disk('local')->delete('public/mahasiswa/'.basename($mahasiswa->image));

        if($mahasiswa->user) {
            $mahasiswa->user->delete();
        }
        
        $mahasiswa->delete();

        return redirect()->route('my.mahasiswas.index');
    }


}
