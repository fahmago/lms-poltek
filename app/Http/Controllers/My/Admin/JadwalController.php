<?php

namespace App\Http\Controllers\My\Admin;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Prodi;
use Carbon\Carbon;
use Illuminate\Http\Request;

class JadwalController extends Controller
{
    public function index()
    {
        $jadwals = Jadwal::when(request()->q, function($jadwals) {
            $search = request()->q;
            $jadwals = $jadwals->where(function ($query) use ($search) {
                $query->where('tahun', 'like', '%' . $search . '%')
                        ->orWhere('tanggal', 'like', '%' . $search . '%')
                        ->orWhereHas('kelas', function($q) use ($search) {
                            $q->where('nama_kelas', 'like', '%' . $search . '%');
                                // ->orWhere('email', 'like', '%' . $search . '%');
                        });
            });
        })->with(['kelas'])->paginate(16);

        $jadwals->appends(['q' => request()->q]);

        // $jadwals = Jadwal::with('kelas')->paginate(10);
        return inertia('My/Admin/Jadwal/Index', [
            'jadwals' => $jadwals,
        ]);        
    }

    public function create()
    {
        $angkatans = Angkatan::all();
        $prodis = Prodi::all();
        return inertia('My/Admin/Jadwal/Create', [
            'angkatans' => $angkatans,
            'prodis' => $prodis
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'kode_tahun' => 'required|exists:angkatans,kode_tahun',
            'semester' => 'required',
            'jumlah_pertemuan' => 'required|integer|max:16|min:1',
            'start_date' => 'required|date',
        ]);

        // Ambil data kelas sesuai semester dan tahun
        $kelasData = Kelas::where('tahun', $request->kode_tahun)
            ->whereHas('matkul', function ($query) use ($request) {
                $query->where('semester', $request->semester);
            })
            ->get();

        // Filter hanya kelas yang belum memiliki jadwal
        $kelasWithoutSchedule = $kelasData->filter(function ($kelas) use ($request) {
            return !Jadwal::where('kode_kelas', $kelas->kode_kelas)
                ->where('tahun', $request->kode_tahun)
                ->where('semester', $request->semester)
                ->exists();
        });

        if ($kelasWithoutSchedule->isEmpty()) {
            return redirect()->route('my.jadwal.index')->with('message', 'Tidak ada jadwal baru untuk dibuat.');
        }

        // Ambil tanggal mulai
        $startDate = Carbon::createFromFormat('Y-m-d', $request->start_date);

        // Daftar hari kerja (Senin - Jumat)
        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // Daftar ruangan yang tersedia
        $ruangans = ['A101', 'A102', 'A103', 'A104', 'A105', 'B101', 'B102', 'B103', 'B104', 'B105'];

        $usedStartTimes = []; // Untuk melacak waktu yang sudah digunakan

        // Loop setiap kelas tanpa jadwal
        foreach ($kelasWithoutSchedule as $index => $kelas) {
            // Hitung SKS (1 SKS = 1 jam)
            $sks = $kelas->matkul->sks ?? 1;
            $duration = $sks * 1;

            // Tentukan hari dan jam untuk kelas ini
            $dayIndex = $index % count($daysOfWeek); // Rotasi hari berdasarkan index kelas
            $fixedDay = $daysOfWeek[$dayIndex]; // Hari tetap untuk kelas ini
            $meetingDate = $startDate->copy()->next($fixedDay); // Tanggal pertama di hari tetap

            // Tetapkan jam mulai unik
            $jamMulai = $this->generateUniqueStartTime($usedStartTimes);
            $jamSelesai = $jamMulai->copy()->addHours($duration);

            // Tetapkan ruangan secara rotasi
            $ruangan = $ruangans[$index % count($ruangans)];

            // Loop untuk semua pertemuan
            for ($pertemuan = 0; $pertemuan < $request->jumlah_pertemuan; $pertemuan++) {
                // Tentukan tanggal berdasarkan pekan
                $currentMeetingDate = $meetingDate->copy()->addWeeks($pertemuan);

                // Simpan jadwal
                Jadwal::create([
                    'kode_kelas' => $kelas->kode_kelas,
                    'tahun' => $request->kode_tahun,
                    'semester' => $request->semester,
                    'jam_mulai' => $jamMulai->format('H:i'),
                    'jam_selesai' => $jamSelesai->format('H:i'),
                    'ruangan' => $ruangan,
                    'tanggal' => $currentMeetingDate->format('Y-m-d'),
                ]);
            }

            // Tandai jam mulai sebagai digunakan
            $usedStartTimes[] = $jamMulai->format('H:i');
        }

        return redirect()->route('my.jadwal.index')->with('message', 'Jadwal berhasil dibuat.');
    }

    private function generateUniqueStartTime($usedStartTimes)
    {
        $availableStartTimes = [];
        for ($hour = 8; $hour <= 17; $hour++) { 
            $availableStartTimes[] = Carbon::createFromTime($hour, 0);
        }

        $availableStartTimes = array_filter($availableStartTimes, function ($time) use ($usedStartTimes) {
            return !in_array($time->format('H:i'), $usedStartTimes);
        });

        if (count($availableStartTimes) > 0) {
            return collect($availableStartTimes)->random();
        }

        return Carbon::createFromTime(8, 0);
    }

}
