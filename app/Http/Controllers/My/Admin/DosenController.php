<?php

namespace App\Http\Controllers\My\Admin;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class DosenController extends Controller
{
    public function index()
    {
        $dosens = Dosen::when(request()->q, function($dosens) {
            $search = request()->q;
            $dosens = $dosens->where(function ($query) use ($search) {
                $query->where('nidn', 'like', '%' . $search . '%')
                        ->orWhereHas('user', function($q) use ($search) {
                            $q->where('name', 'like', '%' . $search . '%')
                                ->orWhere('email', 'like', '%' . $search . '%');
                        });
            });
        })->with(['user','prodi'])->paginate(10);

        $dosens->appends(['q' => request()->q]);

        // $dosens = QueryHelper::applySearchAndPagination(
        //     Dosen::query()->with(['user', 'prodi']), // Base query
        //     ['nidn'], // Searchable fields
        //     [
        //         'user' => ['name', 'email'], // Searchable fields in relation
        //     ],
        //     request()->q // Search keyword
        // );

        return inertia('My/Admin/Dosen/Index', [
            'dosens' => $dosens,
        ]);        
    }

    public function create()
    {
        $prodis = Prodi::all();
        $roles = Role::all();
        return inertia('My/Admin/Dosen/Create', [
            'prodis' => $prodis,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nidn'          => 'nullable|unique:dosens,nidn|max:20',
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:4',
            'kode_prodi'    => 'required|exists:prodis,kode_prodi',
            'role'          => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']); 

        Dosen::create([
            'user_id' => $user->id,
            'nidn' => $validated['nidn'] ?? null,
            'kode_prodi' => $validated['kode_prodi'],
        ]);

        return redirect()->route('my.dosens.index');
    }

    public function edit(Request $request, $uuid)
    {
        $dosen = Dosen::with('user')->where('uuid', $uuid)->firstOrFail();
        $prodis = Prodi::all();

        return inertia('My/Admin/Dosen/Edit', [
            'dosen' => $dosen,
            'prodis' => $prodis,
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $dosen = Dosen::with('user')->where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'nidn' => 'nullable|string|max:20|unique:dosens,nidn,' . $dosen->id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $dosen->user_id,
            'password' => 'nullable|string|min:4', // Password opsional
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'telepon' => 'nullable|unique:dosens,telepon,' . $dosen->id,
            'gender' => 'nullable|in:L,P',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_lengkap' => 'nullable|boolean',
        ]);

        // Update logic
        $dosen->update([
            'nidn' => $request->nidn,
            'kode_prodi' => $request->kode_prodi,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'telepon' => $request->telepon,
            'gender' => $request->gender,
            'is_lengkap' => $request->is_lengkap,
        ]);

        if ($request->hasFile('image')) {

            if ($dosen->image) {
                Storage::disk('local')->delete('public/dosen/'.basename($dosen->image));
            }

            $image = $request->file('image');
            $image->storeAs('public/dosen', $image->hashName());
            $dosen->update([
                'image' => $image->hashName(),
            ]);
        }

        // Update user details
        $dosen->user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $dosen->user->password,
        ]);

        return redirect()->route('my.dosens.index');
    }

    public function destroy($uuid)
    {
        $dosen = Dosen::where('uuid', $uuid)->firstOrFail();

        Storage::disk('local')->delete('public/dosen/'.basename($dosen->image));

        if ($dosen->user) {
            $dosen->user->delete();
            
        }
        
        $dosen->delete();

        return redirect()->route('my.dosens.index');
    }
}
