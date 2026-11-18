<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/kursus', [CourseController::class, 'index'])->name('courses.index');
Route::get('/kursus/{course}', [CourseController::class, 'show'])->name('courses.show');
Route::get('/kursus/{course}/modul/{module}', [CourseController::class, 'module'])->name('courses.module');
Route::post('/kursus/{course}/modul/{module}/selesai', [CourseController::class, 'completeModule'])->name('courses.module.complete');

Route::middleware('auth')->group(function () {
    Route::get('/ujian-sertifikasi', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/ujian-sertifikasi/hasil/{result}', [ExamController::class, 'result'])->name('exams.result');
    Route::get('/ujian-sertifikasi/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::get('/ujian-sertifikasi/{exam}/mulai', [ExamController::class, 'take'])->name('exams.take');
    Route::post('/ujian-sertifikasi/{exam}/submit', [ExamController::class, 'submit'])->name('exams.submit');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
