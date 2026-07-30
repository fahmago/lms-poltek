<?php

namespace App\Http\Controllers\My\Admin\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\KategoriKelasHarian;
use Illuminate\Http\Request;

class KategoriKelasHarianController extends Controller
{
    public function index()
    {
        $kategori = KategoriKelasHarian::withCount('kelasHarians')
            ->when(request()->q, function ($query) {
                $search = request()->q;
                $query->where('nama_kategori', 'like', '%' . $search . '%')
                    ->orWhere('deskripsi', 'like', '%' . $search . '%');
            })
            ->orderBy('nama_kategori', 'asc')
            ->paginate(10);

        $kategori->appends(['q' => request()->q]);

        return inertia('My/Admin/Harian/KategoriKelasHarian/Index', [
            'kategori' => $kategori,
        ]);
    }

    public function create()
    {
        return inertia('My/Admin/Harian/KategoriKelasHarian/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        KategoriKelasHarian::create([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->route('my.kategori_kelas_harians.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit($uuid)
    {
        $kategori = KategoriKelasHarian::where('uuid', $uuid)->firstOrFail();
        session(['previous_url' => url()->previous()]);
        return inertia('My/Admin/Harian/KategoriKelasHarian/Edit', [
            'kategoriKelasHarian' => $kategori,
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $kategori = KategoriKelasHarian::where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'nama_kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi' => $request->deskripsi,
        ]);

        // return redirect()->route('my.kategori_kelas_harians.index')->with('success', 'Kategori berhasil diperbarui.');
        return redirect(session('previous_url'))->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy($uuid)
    {
        $kategori = KategoriKelasHarian::where('uuid', $uuid)->firstOrFail();
        $kategori->delete();

        return redirect()->route('my.kategori_kelas_harians.index')->with('success', 'Kategori berhasil dihapus.');
    }

    public function toggleItStatus(Request $request, $uuid)
    {
        $kategori = KategoriKelasHarian::where('uuid', $uuid)->firstOrFail();

        // Membalik nilai boolean (true jadi false, false jadi true)
        $kategori->update([
            'is_it' => !$kategori->is_it
        ]);

        $message = $kategori->is_it ? 'Kategori ditandai sebagai IT.' : 'Kategori ditandai sebagai Non-IT.';

        return redirect()->back()->with('success', $message);
    }

    public function updateJenis(Request $request, $uuid)
    {
        $kategori = KategoriKelasHarian::where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'jenis' => 'nullable|in:IT,ENGLISH,AGAMA'
        ]);

        $kategori->update([
            'jenis' => $request->jenis
        ]);

        $message = match ($request->jenis) {
            'IT'        => 'Jenis kategori diubah menjadi IT.',
            'ENGLISH'   => 'Jenis kategori diubah menjadi English.',
            'AGAMA'     => 'Jenis kategori diubah menjadi Agama.',
            null, 
            ''          => 'Jenis kategori dihapus.',
            default     => 'Jenis kategori berhasil diperbarui.',
        };

        return back()->with('success', $message);
    }
}
