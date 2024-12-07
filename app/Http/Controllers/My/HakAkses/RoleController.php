<?php

namespace App\Http\Controllers\My\HakAkses;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::when(request()->q, function($roles) {
            $roles = $roles->where('name', 'like', '%'. request()->q .'%');
        })->with('permissions')->latest()->paginate(5);

        //append query string to pagination links
        $roles->appends(['q' => request()->q]);

        //render with inertia
        return inertia('My/HakAkses/Roles/Index', [
        'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //get permission all
        $permissions = Permission::all();
        //render with inertia

        return inertia('My/HakAkses/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //set validation
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required',
        ]);

        //create role
        $role = Role::create(['name' => $request->name]);

        //assign permissions to role
        $role->givePermissionTo($request->permissions);

        //redirect
        return redirect()->route('my.roles.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //get role
        $role = Role::with('permissions')->findOrFail($id);
        //get permission all

        $permissions = Permission::all();
        //render with inertia

        return inertia('My/HakAkses/Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        //set validation
        $request->validate([
            'name' => 'required',
            'permissions' => 'required',
        ]);

        //update role
        $role->update(['name' => $request->name]);

        //sync permissions
        $role->syncPermissions($request->permissions);

        //redirect
        return redirect()->route('my.roles.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        //delete role
        $role->delete();

        //redirect
        return redirect()->route('my.roles.index');
    }
}
