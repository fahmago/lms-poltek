<?php

namespace App\Http\Middleware;

use App\Models\Ibadah\LaporanIbadah;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CekLaporanIbadahWajibMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if ($user && $user->can('mhs.ingat.laporan')) {
            $mahasiswa = $user->mahasiswa;

            if ($mahasiswa) {
                $today = Carbon::today();
                $start = $today->copy()->subDays(7); // 7 hari terakhir (kecuali hari ini)

                $tanggal_terisi = LaporanIbadah::where('mahasiswa_id', $mahasiswa->id)
                    ->whereBetween('tanggal_laporan', [$start, $today->copy()->subDay()])
                    ->pluck('tanggal_laporan')
                    ->map(fn($t) => $t->toDateString())
                    ->toArray();

                $semuaTanggal = collect(range(1, 7))
                    ->map(fn($i) => $today->copy()->subDays($i)->toDateString())
                    ->toArray();

                $tanggal_kosong = array_diff($semuaTanggal, $tanggal_terisi);

                if (count($tanggal_kosong) > 0) {
                    // 🚫 Cegah akses ke route lain selain laporan ibadah
                    if (!str_contains($request->route()->getName(), 'mhs.laporan-ibadah')) {
                        session()->flash('tanggal_kosong', $tanggal_kosong);
                        return redirect()->route('mhs.laporan-ibadah.index');
                    }
                }
            }
        }

        return $next($request);
    }
}
