<?php

namespace App\Http\Controllers\My;

use App\Http\Controllers\Controller;
use App\Models\Harian\JadwalHarian;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        // Jika user punya relasi mahasiswa
        if ($user->mahasiswa) {
            return $this->dashboardMahasiswa();
        }

        // Jika user punya relasi dosen
        if ($user->dosen) {
            return $this->dashboardDosen();
        }

        // Jika user tidak memiliki relasi dosen atau mahasiswa
        if (!$user->dosen && !$user->mahasiswa) {
            return $this->dashboardAdmin();
        }

        return inertia('My/Dashboard/Index');
    }

    private function dashboardAdmin()
    {
        // === DATA WIDGET JADWAL DOSEN HARI INI ===
        $jadwalHariIni = JadwalHarian::whereDate('tanggal', Carbon::today())
            ->with(['kelasHarian.dosen.user'])
            ->get();
        $jadwalPerDosen = $jadwalHariIni->groupBy(fn($item) => $item->kelasHarian->dosen->user->name ?? 'Dosen Tidak Dikenal')
            ->sortBy(fn($jadwals, $namaDosen) => $namaDosen);

        // === DATA WIDGET PENGGUNA AKTIF (VERSI SIMPEL) ===
        $fiveMinutesAgo = now()->subMinutes(60)->getTimestamp();
        $usersOnline = DB::table('sessions')
            ->where('user_id', '!=', null)
            ->where('last_activity', '>', $fiveMinutesAgo)
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->orderBy('last_activity', 'desc')
            ->select('users.name', 'sessions.ip_address', 'sessions.last_activity', 'sessions.user_agent')
            ->paginate(10);

        $usersOnline->getCollection()->transform(function ($session) {
            // Buat parser untuk setiap user agent dari database
            $parser = new \WhichBrowser\Parser($session->user_agent);

            // Tambahkan properti baru ke objek session
            // Pustaka ini memberikan info yang lebih terstruktur
            $session->device   = $parser->device->type ?? 'Tidak Dikenal'; // 'desktop', 'mobile', 'tablet'
            $session->platform = $parser->os->name ?? 'Tidak Dikenal';    // 'Windows', 'Android', 'iOS'
            $session->browser  = $parser->browser->name ?? 'Tidak Dikenal'; // 'Chrome', 'Safari'

            return $session;
        });

        // === DATA WIDGET KESEHATAN SISTEM ===
        $systemHealth = [];
        try {
            DB::connection()->getPdo();
            $systemHealth['database'] = 'Connected';
        } catch (\Exception $e) {
            $systemHealth['database'] = 'Error';
            Log::error("Dashboard DB Check Failed: " . $e->getMessage());
        }
        try {
            $systemHealth['queue_size'] = DB::table('jobs')->count();
        } catch (\Exception $e) {
            $systemHealth['queue_size'] = 'N/A';
        }
        try {
            $systemHealth['failed_jobs'] = DB::table('failed_jobs')->count();
        } catch (\Exception $e) {
            $systemHealth['failed_jobs'] = 'N/A';
        }

        $dbStats = $this->getDatabaseStats();
        $systemHealth['table_count'] = $dbStats['table_count'];
        $systemHealth['total_rows'] = $dbStats['total_rows'];
        $systemHealth['today_rows'] = $dbStats['today_rows'];

        $storagePath = storage_path('app/public');
        $freeSpace = @disk_free_space($storagePath) ?: 0;
        $totalSpace = @disk_total_space($storagePath) ?: 1; // Hindari pembagian dengan nol
        $usedSpace = $totalSpace - $freeSpace;
        $usedPercentage = ($usedSpace / $totalSpace) * 100;

        $systemHealth['disk'] = [
            'total' => round($totalSpace / 1073741824, 2) . ' GB',
            'used_percentage' => round($usedPercentage),
        ];
        $systemHealth['environment'] = [
            'app_env' => config('app.env'),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ];

        return inertia('My/Dashboard/IndexAdmin', [
            'jadwalPerDosen' => $jadwalPerDosen,
            'usersOnline' => $usersOnline,
            'systemHealth' => $systemHealth,
        ]);
    }

    private function dashboardDosen()
    {
        $dosen = Auth::user()->dosen;

        // Ambil jadwal mengajar khusus untuk hari ini
        $jadwalHariIni = $dosen->jadwalDosenHarians() // Relasi ini sudah melakukan join
            ->whereDate('jadwal_harians.tanggal', Carbon::today())
            ->with('kelasHarian')
            // Anda tetap bisa mengurutkan berdasarkan kolom dari tabel perantara
            ->orderBy('kelas_harians.jam_mulai', 'asc')
            ->get();

        // Data untuk widget "Pengguna Aktif Saat Ini" (dengan Paginasi)
        $fiveMinutesAgo = now()->subMinutes(60)->getTimestamp();

        $usersOnline = DB::table('sessions')
            ->where('user_id', '!=', null)
            ->where('last_activity', '>', $fiveMinutesAgo)
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->orderBy('last_activity', 'desc')
            ->select('users.name', 'sessions.ip_address', 'sessions.last_activity', 'sessions.user_agent')
            ->paginate(10); // 10 item per halaman

        $usersOnline->getCollection()->transform(function ($session) {
            // Buat parser untuk setiap user agent dari database
            $parser = new \WhichBrowser\Parser($session->user_agent);

            // Tambahkan properti baru ke objek session
            // Pustaka ini memberikan info yang lebih terstruktur
            $session->device   = $parser->device->type ?? 'Tidak Dikenal'; // 'desktop', 'mobile', 'tablet'
            $session->platform = $parser->os->name ?? 'Tidak Dikenal';    // 'Windows', 'Android', 'iOS'
            $session->browser  = $parser->browser->name ?? 'Tidak Dikenal'; // 'Chrome', 'Safari'

            return $session;
        });

        return inertia('My/Dashboard/IndexDosen', [
            'jadwalHariIni' => $jadwalHariIni,
            'usersOnline' => $usersOnline, // Kirim data pengguna aktif
        ]);
    }

    private function dashboardMahasiswa()
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // 1. Ambil semua ID kelas yang diikuti mahasiswa
        $kelasIds = $mahasiswa->kelasHariansKehadiranStatus()->pluck('kelas_harians.id');

        // 2. Cari semua jadwal untuk hari ini yang ada di dalam kelas-kelas tersebut
        $jadwalHariIni = JadwalHarian::whereIn('kelas_harian_id', $kelasIds)
            ->join('kelas_harians', 'jadwal_harians.kelas_harian_id', '=', 'kelas_harians.id')
            ->whereDate('jadwal_harians.tanggal', Carbon::today())
            ->with(['kelasHarian.dosen.user']) // Eager load sampai ke user dosen
            ->orderBy('kelas_harians.jam_mulai', 'asc')
            ->select('jadwal_harians.*')
            ->get();
        
        // 3. Data untuk widget "Pengguna Aktif Saat Ini"
        $fiveMinutesAgo = now()->subMinutes(60)->getTimestamp();

        $usersOnline = DB::table('sessions')
            ->where('sessions.user_id', '!=', null)
            ->where('sessions.last_activity', '>', $fiveMinutesAgo)
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->leftJoin('mahasiswas', 'users.id', '=', 'mahasiswas.user_id')
            ->leftJoin('dosens', 'users.id', '=', 'dosens.user_id')
            ->where(function ($q) {
                $q->whereNotNull('mahasiswas.id')
                    ->orWhereNotNull('dosens.id');
            })
            ->orderBy('sessions.last_activity', 'desc')
            ->select(
                'users.name',
                'sessions.ip_address',
                'sessions.last_activity',
                'sessions.user_agent'
            )
            ->paginate(10);

        // Tambahkan parsing User Agent (device, browser, OS)
        $usersOnline->getCollection()->transform(function ($session) {
            $parser = new \WhichBrowser\Parser($session->user_agent);

            $session->device   = $parser->device->type    ?? 'Tidak Dikenal';
            $session->platform = $parser->os->name        ?? 'Tidak Dikenal';
            $session->browser  = $parser->browser->name   ?? 'Tidak Dikenal';

            return $session;
        });

        return inertia('My/Dashboard/IndexMahasiswa', [
            'jadwalHariIni' => $jadwalHariIni,
            'usersOnline' => $usersOnline,
        ]);
    }

    private function getDatabaseStats()
    {
        $driver = DB::connection()->getDriverName();
        $tablesData = collect(); // Gunakan collection

        try {
            // 1. Dapatkan daftar tabel berdasarkan driver
            switch ($driver) {
                case 'mysql':
                    $dbName = DB::connection()->getDatabaseName();
                    $tablesData = DB::table('information_schema.tables')
                        ->where('table_schema', $dbName)
                        ->where('table_type', 'BASE TABLE')
                        // --- PERBAIKAN DI SINI ---
                        // Gunakan selectRaw untuk membuat alias 'table_name' (lowercase)
                        // dari 'TABLE_NAME' (uppercase)
                        ->selectRaw('TABLE_NAME as table_name')
                        ->pluck('table_name');
                    break;

                case 'pgsql':
                    $tablesData = DB::table('information_schema.tables')
                        ->where('table_schema', 'public')
                        ->where('table_type', 'BASE TABLE')
                        // --- PERBAIKAN DI SINI ---
                        ->selectRaw('TABLE_NAME as table_name')
                        ->pluck('table_name');
                    break;

                case 'sqlite':
                    // Untuk sqlite, kolomnya sudah 'name' (lowercase), jadi ini aman
                    $tablesData = DB::table('sqlite_master')
                        ->where('type', 'table')
                        ->whereNotIn('name', ['sqlite_sequence'])
                        ->select('name') // Lebih eksplisit
                        ->pluck('name');
                    break;

                case 'sqlsrv':
                    $tablesData = DB::table('information_schema.tables')
                        ->where('table_type', 'BASE TABLE')
                        // --- PERBAIKAN DI SINI ---
                        ->selectRaw('TABLE_NAME as table_name')
                        ->pluck('table_name');
                    break;

                default:
                    Log::warning("Dashboard Stats: Driver database '$driver' tidak didukung.");
                    return ['table_count' => 'N/A', 'total_rows' => 'N/A'];
            }

            // 2. Hitung jumlah tabel
            $tableCount = $tablesData->count();
            $totalRows = 0;
            $todayRows = 0;

            // 3. Tentukan tabel internal Laravel yang akan dilewati
            $excludedTables = [
                'migrations',
                'failed_jobs',
                'jobs',
                'sessions',
                'password_reset_tokens',
                'cache',
                'cache_locks',
                'personal_access_tokens'
            ];

            // Filter tabel yang dikecualikan dari list
            $tablesToCount = $tablesData->diff($excludedTables);

            // 4. Loop dan hitung baris (Bagian yang lambat)
            foreach ($tablesToCount as $table) {
                try {
                    $totalRows += DB::table($table)->count();
                    $todayRows += DB::table($table)
                        ->whereDate('created_at', Carbon::today())
                        ->count();
                } catch (\Exception $e) {
                    // Tangani jika ada error (misal: tabel adalah VIEW yg kompleks)
                    Log::warning("Dashboard: Gagal menghitung baris untuk tabel $table: " . $e->getMessage());
                }
            }

            return ['table_count' => $tableCount, 'total_rows' => $totalRows, 'today_rows' => $todayRows];
        } catch (\Exception $e) {
            // Tangani jika query ke information_schema gagal
            Log::error("Dashboard getDatabaseStats Gagal Total: " . $e->getMessage());
            return ['table_count' => 'N/A', 'total_rows' => 'N/A'];
        }
    }
}
