<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckMahasiswaProfileCompletion
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // $user = Auth::user();
        // $mahasiswa = $user->mahasiswa; 
        // if ($mahasiswa && !$mahasiswa->is_lengkap) {
        //     return redirect()
        //         ->route('mhs.profil.index')
        //         ->with('warning', 'Silakan lengkapi profil Anda terlebih dahulu.');
        // }
        $user = Auth::user();
        // if ($user->roles()->where('name', 'mahasiswa')->exists()) {
        //     $mahasiswa = $user->mahasiswa;
        //     if ($mahasiswa->is_lengkap == 0) {
        //         return redirect()
        //             ->route('mhs.profil.index')
        //             ->with('warning', 'Silakan lengkapi profil Anda terlebih dahulu.');
        //     }
        // }
        if ($user->roles()->where('name', 'mahasiswa')->exists() && !$user->mahasiswa->is_lengkap) {
            return redirect()
                ->route('mhs.profil.index')
                ->with('warning', 'Silakan lengkapi profil Anda terlebih dahulu.');
        }
        return $next($request);
    }
}
