<?php

use App\Http\Controllers\My\Admin\Ibadah\PertanyaanController;
use Illuminate\Support\Facades\Route;

Route::controller(PertanyaanController::class)->prefix('pertanyaan-ibadah')->name('my.pertanyaan.ibadah.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:pertanyaan.ibadah.index');
    Route::get('/new', 'create')->name('create')->middleware('permission:pertanyaan.ibadah.create');
    Route::post('/', 'store')->name('store')->middleware('permission:pertanyaan.ibadah.create');
    Route::get('/{pertanyaan:uuid}/edit', 'edit')->name('edit')->middleware('permission:pertanyaan.ibadah.edit');
    Route::put('/{pertanyaan:uuid}', 'update')->name('update')->middleware('permission:pertanyaan.ibadah.edit');
    Route::delete('/{pertanyaan:uuid}', 'destroy')->name('destroy')->middleware('permission:pertanyaan.ibadah.delete');
});