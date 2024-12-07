<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function index()
    {
        return inertia('Auth/Login');
    }

    public function store(Request $request)
    {
        //set validation
        $request->validate([
            'email'     => 'required|email',
            'password'  => 'required',
        ]);

        //get email and password from request
        $credentials = $request->only('email', 'password');

        //attempt to login
        if (Auth::attempt($credentials)) {

            // dd('Ada');

            //regenerate session
            $request->session()->regenerate();

             // Set session untuk pesan toast
            session()->flash('toast', 'Login berhasil!');

            //redirect route dashboard
            return redirect()->route('my.dashboard.index');

        }

        //if login fails
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function store2(Request $request)
    {
        // Set validation
        $request->validate([
            'email'     => 'required',
            'password'  => 'required',
        ]);

        // Get email or NIM and password from request
        $credentials = $request->only('email', 'password');

        // Cek apakah yang dimasukkan adalah email atau NIM
        if (filter_var($credentials['email'], FILTER_VALIDATE_EMAIL)) {
            // Jika input adalah email, cari user berdasarkan email
            $user = User::where('email', $credentials['email'])->first();
        } else {
            // Jika input bukan email, cari user berdasarkan NIM (relasi dengan Mahasiswa)
            $user = User::whereHas('mahasiswa', function ($query) use ($credentials) {
                $query->where('nim', $credentials['email']);
            })->first();
        }

        // Jika user ditemukan dan password cocok
        if ($user && Hash::check($credentials['password'], $user->password)) {
            // Cek password menggunakan Hash
            Auth::login($user);

            // Regenerate session
            $request->session()->regenerate();

            // Set session untuk pesan toast
            session()->flash('toast', 'Login berhasil!');

            // Redirect ke route dashboard
            return redirect()->route('my.dashboard.index');
        }

        // Jika login gagal
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

}
