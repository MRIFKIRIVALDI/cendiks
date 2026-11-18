<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ExamResult;
use App\Models\CourseProgress;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Ambil riwayat ujian sertifikasi pengguna
        $examResults = ExamResult::where('user_id', $user->id)
            ->with('certificationExam')
            ->latest()
            ->get();

        // Ambil progress modul belajar
        $completedModules = CourseProgress::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->count();

        // Statistik ringkas
        $stats = [
            'completed_modules' => $completedModules,
            'total_exams' => $examResults->count(),
            'passed_exams' => $examResults->where('status', 'passed')->count(),
            'certificates_earned' => $examResults->where('status', 'passed')->count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'examResults' => $examResults,
        ]);
    }
}
