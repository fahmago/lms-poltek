<?php

namespace App\Http\Controllers\My\HakAkses;

use App\Http\Controllers\Controller;
use App\Imports\UsersDosenImport;
use App\Imports\UsersImport;
use App\Imports\UsersMahasiswaImport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        // Get users with search functionality
        $users = User::when(request()->q, function($users) {
                $search = request()->q;
                $users = $users->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                            ->orWhere('email', 'like', '%' . $search . '%')
                            ->orWhereHas('roles', function ($query) use ($search) {
                                $query->where('name', 'like', '%' . $search . '%');
                            });
                });
            })->with('roles')->latest()->paginate(10);

        // Append query string to pagination links
        $users->appends(['q' => request()->q]);

        // Return inertia view with the users data
        return inertia('My/HakAkses/Users/Index', [
            'users' => $users
        ]);

    }

    public function create()
    {
        //get roles
        $roles = Role::all();

        //return inertia
        return inertia('My/HakAkses/Users/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        //set validation
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'role' => 'required|array|min:1',  // Validasi untuk roles
            'role.*' => 'exists:roles,name',   // Pastikan setiap role yang dipilih valid
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        //assign roles to user
        $user->assignRole($request->role);

        //redirect
        return redirect()->route('my.users.index');
    }

    public function edit($id)
    {
        //get user
        $user = User::with('roles')->findOrFail($id);

        //get roles
        $roles = Role::all();

        session(['previous_url' => url()->previous()]);

        //return inertia
        return inertia('My/HakAkses/Users/Edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users,email,'.$user->id,
            'password' => 'nullable|confirmed'
        ]);
        
        if($request->password == '') {
            $user->update([
                'name'  => $request->name,
                'email' => $request->email
            ]);
        } else {
            $user->update([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => bcrypt($request->password)
            ]);
        }

        //assign roles to user
        $user->syncRoles($request->roles);

        //redirect
        // return redirect()->back();
        return redirect(session('previous_url'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $mahasiswa = $user->mahasiswa;

        if ($mahasiswa && $mahasiswa->image) {
            Storage::disk('local')->delete('public/mahasiswa/' . basename($mahasiswa->image));
        }

        if ($mahasiswa) {
            $mahasiswa->delete();
        }

        $user->delete();
        return redirect()->route('my.users.index');
    }

    public function showImportMhsForm()
    {
        return inertia('My/HakAkses/Users/MahasiswaImport'); 
    }

    public function importMhsExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
        ]);

        try {
            Excel::import(new UsersMahasiswaImport, $request->file('file'));
            return redirect()->route('my.users.index');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to import users: ' . $e->getMessage());
        }
    }

    public function showImportDsnForm()
    {
        return inertia('My/HakAkses/Users/DosenImport'); 
    }

    public function importDsnExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
        ]);

        try {
            // Excel::import(new UsersImport, $request->file('file'));
            Excel::import(new UsersDosenImport, $request->file('file'));
            return redirect()->route('my.users.index');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to import users: ' . $e->getMessage());
        }
    }

}
