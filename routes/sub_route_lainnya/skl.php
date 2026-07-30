<?php

use App\Http\Controllers\My\Admin\SKL\BukuController;
use App\Http\Controllers\My\Admin\SKL\PortofolioController;
use App\Http\Controllers\My\Admin\SKL\ProjectSemesterController;
use App\Http\Controllers\My\Admin\SKL\SertifikatController;
use Illuminate\Support\Facades\Route;


Route::controller(ProjectSemesterController::class)->prefix('project-semester')->name('my.project_semester.')->group(function () { // Ganti prefix & name
    // Ganti permission
    Route::get('/', 'index')->name('index')->middleware('permission:project.semester.index'); 
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:project.semester.show');
    // Ganti route model binding & permission
    Route::get('/task/{projectSemester:uuid}', 'detail')->name('detail')->middleware('permission:project.semester.show');
    Route::get('/new', 'create')->name('create')->middleware('permission:project.semester.create');
    Route::get('/task/{projectSemester:uuid}/edit', 'edit')->name('edit')->middleware('permission:project.semester.edit');
    Route::put('/task/{projectSemester:uuid}', 'update')->name('update')->middleware('permission:project.semester.edit');
    Route::delete('/task/{projectSemester:uuid}', 'destroy')->name('destroy')->middleware('permission:project.semester.delete');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:project.semester.create');
    Route::post('/', 'store')->name('store')->middleware('permission:project.semester.create');
    // Ganti route model binding
    Route::post('/submission/{pengumpulanProjectSemester:uuid}/grade', 'submitGrade')->name('submit_grade');
    // ... route lainnya ...
    Route::post('/bulk-update-deadline', 'bulkUpdateDeadline')->name('bulk_update_deadline')->middleware('permission:project.semester.edit');
});

Route::controller(PortofolioController::class)->prefix('portofolio')->name('my.portofolio.')->group(function () { // Ganti prefix & name
    // Ganti permission
    Route::get('/', 'index')->name('index')->middleware('permission:portofolio.index'); 
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:portofolio.show');
    // Ganti route model binding & permission
    Route::get('/task/{portofolio:uuid}', 'detail')->name('detail')->middleware('permission:portofolio.show');
    Route::get('/new', 'create')->name('create')->middleware('permission:portofolio.create');
    Route::get('/task/{portofolio:uuid}/edit', 'edit')->name('edit')->middleware('permission:portofolio.edit');
    Route::put('/task/{portofolio:uuid}', 'update')->name('update')->middleware('permission:portofolio.edit');
    Route::delete('/task/{portofolio:uuid}', 'destroy')->name('destroy')->middleware('permission:portofolio.delete');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:portofolio.create');
    Route::post('/', 'store')->name('store')->middleware('permission:portofolio.create');
    // Ganti route model binding
    Route::post('/submission/{pengumpulanPortofolio:uuid}/grade', 'submitGrade')->name('submit_grade');
    Route::post('/bulk-update-deadline', 'bulkUpdateDeadline')->name('bulk_update_deadline')->middleware('permission:portofolio.edit');
});

Route::controller(BukuController::class)->prefix('buku')->name('my.buku.')->group(function () { // Ganti prefix & name
    // Ganti permission
    Route::get('/', 'index')->name('index')->middleware('permission:buku.index'); 
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:buku.show');
    // Ganti route model binding & permission
    Route::get('/task/{buku:uuid}', 'detail')->name('detail')->middleware('permission:buku.show');
    Route::get('/new', 'create')->name('create')->middleware('permission:buku.create');
    Route::get('/task/{buku:uuid}/edit', 'edit')->name('edit')->middleware('permission:buku.edit');
    Route::put('/task/{buku:uuid}', 'update')->name('update')->middleware('permission:buku.edit');
    Route::delete('/task/{buku:uuid}', 'destroy')->name('destroy')->middleware('permission:buku.delete');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:buku.create');
    Route::post('/', 'store')->name('store')->middleware('permission:buku.create');
    // Ganti route model binding
    Route::post('/submission/{pengumpulanBuku:uuid}/grade', 'submitGrade')->name('submit_grade');
    Route::post('/bulk-update-deadline', 'bulkUpdateDeadline')->name('bulk_update_deadline')->middleware('permission:buku.edit');
});

Route::controller(SertifikatController::class)->prefix('sertifikat')->name('my.sertifikat.')->group(function () { // Ganti prefix & name
    // Ganti permission
    Route::get('/', 'index')->name('index')->middleware('permission:sertifikat.index'); 
    Route::get('/{uuid}/show', 'show')->name('show')->middleware('permission:sertifikat.show');
    // Ganti route model binding & permission
    Route::get('/task/{sertifikat:uuid}', 'detail')->name('detail')->middleware('permission:sertifikat.show');
    Route::get('/new', 'create')->name('create')->middleware('permission:sertifikat.create');
    Route::get('/task/{sertifikat:uuid}/edit', 'edit')->name('edit')->middleware('permission:sertifikat.edit');
    Route::put('/task/{sertifikat:uuid}', 'update')->name('update')->middleware('permission:sertifikat.edit');
    Route::delete('/task/{sertifikat:uuid}', 'destroy')->name('destroy')->middleware('permission:sertifikat.delete');
    Route::get('/get-classes', 'getClasses')->name('getClasses')->middleware('permission:sertifikat.create');
    Route::post('/', 'store')->name('store')->middleware('permission:sertifikat.create');
    // Ganti route model binding
    Route::post('/submission/{pengumpulanSertifikat:uuid}/grade', 'submitGrade')->name('submit_grade');
    Route::post('/bulk-update-deadline', 'bulkUpdateDeadline')->name('bulk_update_deadline')->middleware('permission:sertifikat.edit');
});
