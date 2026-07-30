<?php

namespace App\Http\Controllers\My\Dosen\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\PengumpulanTugasHarian;
use App\Models\Harian\TugasHarian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TugasHarianDosenController extends Controller
{
    public function index1()
    {
        $kelasHarian = KelasHarian::withCount('tugasHarians')->when(request()->q, function($kelasHarian) {
            $search = request()->q;
            $kelasHarian = $kelasHarian->where(function ($query) use ($search) {
                $query->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
            });
        })->whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->paginate(10);

        $kelasHarian->appends(['q' => request()->q]);

        return inertia('My/Dosen/Harian/TugasHarian/Index', [
            'kelas' => $kelasHarian
        ]);
    }

    public function index()
    {
        // 1. Ambil Tahun untuk Filter
        $availableYears = KelasHarian::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // 2. Set Default Filter (Tahun saat ini & Semua Semester)
        $selectedYear = request()->input('tahun', date('Y'));
        $selectedSemester = request()->input('semester', 'all');

        // 3. Query Data dengan Filter
        $kelasHarian = KelasHarian::withCount('tugasHarians')
            ->when(request()->q, function($kelasHarian) {
                $search = request()->q;
                $kelasHarian->where(function ($query) use ($search) {
                    $query->where('nama_kelas', 'like', '%' . $search . '%')
                            ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun
            ->when($selectedYear !== 'all', function($q) use ($selectedYear) {
                $q->where('tahun', $selectedYear);
            })
            // Filter Semester
            ->when($selectedSemester !== 'all', function($q) use ($selectedSemester) {
                $q->where('semester', $selectedSemester);
            })
            ->whereHas('dosen', function($q) {
                $q->where('user_id', Auth::user()->id);
            })
            ->orderBy('created_at', 'desc') // Opsional: urutkan terbaru
            ->paginate(10);

        // Append query string untuk pagination
        $kelasHarian->appends([
            'q' => request()->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Dosen/Harian/TugasHarian/Index', [
            'kelas' => $kelasHarian,
            'availableYears' => $availableYears, // Kirim ke View
            'filters' => [ // Kirim state filter saat ini
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => request()->q
            ]
        ]);
    }

    public function show($uuid)
    {
        $dosen = Auth::user()->dosen;

        $kelas = KelasHarian::where('uuid', $uuid)
                            ->where('dosen_id', $dosen->id)
                            ->firstOrFail();

        return inertia('My/Dosen/Harian/TugasHarian/Show', [
            'kelas' => $kelas,
            // 'tugas' => $kelas->tugasHarians()->paginate(10),
            'tugas' => $kelas->tugasHarians()->withCount('pengumpulanTugasHarians')->paginate(10),
        ]);
    }

    public function create()
    {
        $kelasHarian = KelasHarian::whereHas('dosen', function($q) {
            $q->where('user_id', Auth::user()->id);
        })->get();
        return inertia('My/Dosen/Harian/TugasHarian/Create', [
            // return inertia('My/Dosen/Tugas/Create', [
            'kelas' => $kelasHarian,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_kelas_harian' => 'required|exists:kelas_harians,kode_kelas_harian',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_deadline' => 'required|date_format:Y-m-d\TH:i|after:today',
            // 'tanggal_deadline' => 'required|date',
        ],[
            'kode_kelas_harian.exists' => 'Kelas tidak ditemukan',
        ]);

        $dosen = Auth::user()->dosen;
        if(!$dosen) {
            return back()->withErrors(['dosen' => 'Data dosen tidak ditemukan untuk user ini.']);
        }   

        try {
            $validated['tanggal_diberikan'] = now();
            TugasHarian::create($validated); 
            return redirect()->route('dsn.dh.tugas.index')->with('success','Berhasil mengirim tugas.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan tugas.')->withInput();
        }        
    }

    public function update(Request $request, $uuid)
    {
        $tugas = TugasHarian::where('uuid', $uuid)->firstOrFail();
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_deadline' => 'required|date_format:Y-m-d\TH:i',
            // 'tanggal_deadline' => 'required|date|after:today',
        ]);
        $tugas->update($validated);
        return redirect()->back();
    }

    public function destroy($uuid)
    {
        $tugas = TugasHarian::where('uuid', $uuid)->firstOrFail();
        $tugas->delete();
        return redirect()->back();
    }

    public function responTugas($uuid)
    {
        $tugas = TugasHarian::where('uuid', $uuid)
                        ->with('pengumpulanTugasHarians.mahasiswa.user', 'kelasHarian')  // Eager load pengumpulanTugas dan mahasiswa
                        ->firstOrFail();

        $pengumpulanTugas = $tugas->pengumpulanTugasHarians;

        // return $pengumpulanTugas;

        return inertia('My/Dosen/Harian/TugasHarian/Respon', [
            // return inertia('My/Dosen/Tugas/Respon', [
            'tugas' => $tugas,  // Kirimkan tugas
            'pengumpulanTugas' => $pengumpulanTugas
        ]);
    }

    public function feedBackTugas(Request $request, $uuid)
    {
        $request->validate([
            'nilai' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);
    
        $pengumpulanTugas = PengumpulanTugasHarian::where('uuid', $uuid)->firstOrFail();

        $pengumpulanTugas->update([
            'nilai' => $request->input('nilai'),
            'feedback' => $request->input('feedback'),
        ]);
    
        return back()->with('success', 'Data tugas berhasil diperbarui.');
    }

    public function deleteRespon($uuid)
    {
        $tugas = PengumpulanTugasHarian::where('uuid', $uuid)->firstOrFail();
        $tugas->delete();
        return redirect()->back();
    }
}
