<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Daftar seluruh kursus.
     */
    public function index()
    {
        $courses = Course::where('is_published', true)
            ->withCount('modules')
            ->orderBy('order')
            ->get();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Detail kursus beserta daftar modul dan status progress user.
     */
    public function show(Request $request, Course $course)
    {
        $course->load(['modules' => fn ($q) => $q->orderBy('order')]);

        $completedIds = [];
        if ($request->user()) {
            $completedIds = CourseProgress::where('user_id', $request->user()->id)
                ->whereNotNull('completed_at')
                ->whereIn('course_module_id', $course->modules->pluck('id'))
                ->pluck('course_module_id')
                ->all();
        }

        $totalModules = $course->modules->count();
        $completedCount = count($completedIds);
        $progress = $totalModules > 0
            ? round(($completedCount / $totalModules) * 100)
            : 0;

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'completedModuleIds' => $completedIds,
            'progress' => $progress,
        ]);
    }

    /**
     * Halaman detail satu modul belajar.
     */
    public function module(Request $request, Course $course, CourseModule $module)
    {
        abort_unless($module->course_id === $course->id, 404);

        $modules = $course->modules()->orderBy('order')->get();

        $completedIds = [];
        if ($request->user()) {
            $completedIds = CourseProgress::where('user_id', $request->user()->id)
                ->whereNotNull('completed_at')
                ->whereIn('course_module_id', $modules->pluck('id'))
                ->pluck('course_module_id')
                ->all();
        }

        // Navigasi modul sebelumnya / berikutnya
        $currentIndex = $modules->search(fn ($m) => $m->id === $module->id);
        $previous = $currentIndex > 0 ? $modules[$currentIndex - 1] : null;
        $next = $modules->get($currentIndex + 1);

        return Inertia::render('Courses/Module', [
            'course' => $course,
            'module' => $module,
            'modules' => $modules,
            'completedModuleIds' => $completedIds,
            'isCompleted' => in_array($module->id, $completedIds),
            'previous' => $previous,
            'next' => $next,
        ]);
    }

    /**
     * Tandai modul selesai.
     */
    public function completeModule(Request $request, Course $course, CourseModule $module)
    {
        abort_unless($module->course_id === $course->id, 404);

        CourseProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'course_module_id' => $module->id,
            ],
            ['completed_at' => now()]
        );

        return redirect()
            ->route('courses.module', [$course->slug, $module->slug])
            ->with('success', 'Modul ditandai selesai.');
    }
}
