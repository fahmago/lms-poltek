<?php

use App\Http\Controllers\My\Admin\Pekanan\TugasPekananController;
use Illuminate\Support\Facades\Route;

Route::controller(TugasPekananController::class)->prefix('tweek')->name('my.tweek.')->group(function () {
    Route::get('/', 'index')->name('index')->middleware('permission:pekanan.index');
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:pekanan.show');
    Route::get('/task/{tugasPekanan:uuid}', 'detail')->name('detail')->middleware('permission:pekanan.show');
    Route::get('/new', 'create')->name('create')->middleware('permission:pekanan.create');
    Route::get('/task/{tugasPekanan:uuid}/edit', 'edit')->name('edit')->middleware('permission:pekanan.edit');
    Route::put('/task/{tugasPekanan:uuid}', 'update')->name('update')->middleware('permission:pekanan.edit');
    Route::delete('/task/{tugasPekanan:uuid}', 'destroy')->name('destroy')->middleware('permission:pekanan.delete');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:pekanan.create');
    Route::post('/', 'store')->name('store')->middleware('permission:pekanan.create');
    Route::post('/submission/{pengumpulanTugasPekanan:uuid}/grade', 'submitGrade')->name('submit_grade');
    
    Route::post('/bulk-update-deadline', 'bulkUpdateDeadline')->name('bulk_update_deadline')->middleware('permission:pekanan.edit');
});