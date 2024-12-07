<?php

use App\Http\Controllers\My\HakAkses\PermissionController;
use App\Http\Controllers\My\HakAkses\RoleController;
use App\Http\Controllers\My\HakAkses\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/permissions', PermissionController::class)->name('my.permissions.index')->middleware('permission:permissions.index');

Route::controller(RoleController::class)->prefix('roles')->name('my.roles.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:roles.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:roles.create');
    Route::post('/', 'store')->name('store')->middleware('permission:roles.create');
    Route::get('/{role}/edit', 'edit')->name('edit')->middleware('permission:roles.edit');
    Route::put('/{role}', 'update')->name('update')->middleware('permission:roles.edit');
    Route::delete('/{role}', 'destroy')->name('destroy')->middleware('permission:roles.delete');
});

Route::controller(UserController::class)->prefix('users')->name('my.users.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:users.index');
    Route::get('/create', 'create')->name('create')->middleware('permission:users.create');
    Route::post('/', 'store')->name('store')->middleware('permission:users.create');
    Route::get('/{user}/edit', 'edit')->name('edit')->middleware('permission:users.edit');
    Route::put('/{user}', 'update')->name('update')->middleware('permission:users.edit');
    Route::delete('/{user}', 'destroy')->name('destroy')->middleware('permission:users.delete');

    Route::get('/mhs-excel', 'showImportMhsForm')->name('mhs.excel')->middleware('permission:users.mhs.excel');
    Route::post('/mhs-excel', 'importMhsExcel')->name('mhs.excel')->middleware('permission:users.mhs.excel');

    Route::get('/dsn-excel', 'showImportDsnForm')->name('dsn.excel')->middleware('permission:users.dsn.excel');
    Route::post('/dsn-excel', 'importDsnExcel')->name('dsn.excel')->middleware('permission:users.dsn.excel');
});