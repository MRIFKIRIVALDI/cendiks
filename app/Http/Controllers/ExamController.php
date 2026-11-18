<?php

namespace App\Http\Controllers;

use App\Models\CertificationExam;
use App\Models\ExamResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ExamController extends Controller
{
    /**
     * Daftar seluruh sertifikasi.
     */
    public function index()
    {
        $exams = CertificationExam::where('is_published', true)
            ->withCount('questions')
            ->get();

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
        ]);
    }

    /**
     * Tampilkan instruksi ujian.
     */
    public function show(CertificationExam $exam)
    {
        $exam->loadCount('questions');
        
        $lastResult = ExamResult::where('user_id', auth()->id())
            ->where('certification_exam_id', $exam->id)
            ->latest()
            ->first();

        return Inertia::render('Exams/Show', [
            'exam' => $exam,
            'lastResult' => $lastResult,
        ]);
    }

    /**
     * Mulai ujian (Engine Quiz).
     */
    public function take(CertificationExam $exam)
    {
        $exam->load(['questions' => function ($q) {
            $q->with('options')->orderBy('order');
        }]);

        // Opsional: Simpan waktu mulai di session
        session(['exam_started_at_' . $exam->id => now()]);

        return Inertia::render('Exams/Take', [
            'exam' => $exam,
        ]);
    }

    /**
     * Submit jawaban dan hitung skor.
     */
    public function submit(Request $request, CertificationExam $exam)
    {
        $exam->load(['questions.options']);
        $answers = $request->input('answers', []); // question_id => option_id
        
        $score = 0;
        $totalPoints = $exam->questions->sum('points');

        foreach ($exam->questions as $question) {
            $selectedOptionId = $answers[$question->id] ?? null;
            $correctOption = $question->options->where('is_correct', true)->first();

            if ($selectedOptionId && $correctOption && $selectedOptionId == $correctOption->id) {
                $score += $question->points;
            }
        }

        $percentage = $totalPoints > 0 ? ($score / $totalPoints) * 100 : 0;
        $status = $percentage >= $exam->passing_score ? 'passed' : 'failed';

        $startedAt = session('exam_started_at_' . $exam->id, now());

        $result = ExamResult::create([
            'user_id' => $request->user()->id,
            'certification_exam_id' => $exam->id,
            'score' => $score,
            'total_score' => $totalPoints,
            'status' => $status,
            'certificate_number' => $status === 'passed' ? 'CEN-' . strtoupper(Str::random(8)) : null,
            'started_at' => $startedAt,
            'finished_at' => now(),
        ]);

        return redirect()->route('exams.result', $result->id);
    }

    /**
     * Tampilkan hasil ujian.
     */
    public function result(ExamResult $result)
    {
        abort_unless($result->user_id === auth()->id(), 403);
        $result->load('certificationExam');

        return Inertia::render('Exams/Result', [
            'result' => $result,
        ]);
    }
}
