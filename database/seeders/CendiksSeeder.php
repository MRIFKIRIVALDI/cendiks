<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CertificationExam;
use Illuminate\Database\Seeder;

class CendiksSeeder extends Seeder
{
    public function run(): void
    {
        // ============ KURSUS: PYTHON INTERAKTIF 40 MODUL ============
        $course = Course::create([
            'title' => 'Python Fullstack Mastery',
            'slug' => 'python-fullstack-mastery',
            'description' => 'Kurikulum komprehensif 40 pertemuan dari dasar hingga mahir.',
            'level' => 'all-levels',
            'icon' => '🐍',
            'accent_color' => '#00FF66',
            'duration_minutes' => 1200,
            'is_published' => true,
            'order' => 1,
        ]);

        $modules = [
            "Pengenalan Python", "Variabel & Tipe Data", "Operator Aritmatika", "Struktur Kontrol: If-Else",
            "Perulangan: For", "Perulangan: While", "Fungsi Dasar", "Parameter & Argumen",
            "Documentation String", "List & Metode", "Tuple & Unpacking", "Dictionary",
            "Set", "String Manipulation", "File Handling", "Exception Handling",
            "Modul Standar", "Package Management", "Object-Oriented Programming", "Inheritance",
            "Polymorphism", "Decorator", "Generator", "Iterators",
            "Comprehension", "Regular Expression", "Date & Time", "DateTime Formatting",
            "Working with CSV", "JSON Handling", "Web Basics", "Request Library",
            "API REST Sederhana", "Unit Testing", "Logging", "Virtual Environment",
            "Deployment Basics", "Data Structures Advanced", "Lambda Functions", "Final Project"
        ];

        foreach ($modules as $index => $title) {
            $course->modules()->create([
                'title' => $title,
                'slug' => strtolower(str_replace(' ', '-', $title)),
                'description' => "Modul ke-" . ($index + 1) . ": Mempelajari $title secara mendalam.",
                'content' => "## $title\n\nSelamat datang di modul " . ($index + 1) . ". Di sini kita akan membahas tentang $title secara komprehensif. Python adalah bahasa yang sangat powerful...\n\n### Materi Utama:\n- Konsep dasar $title\n- Implementasi praktis\n- Best practices\n\n### Latihan:\nCoba jalankan contoh kode di bawah ini.",
                'code_example' => "# Contoh implementasi $title\nprint('Belajar $title')",
                'order' => $index + 1,
                'duration_minutes' => 30,
            ]);
        }

        // ============ UJIAN ============
        $exam = CertificationExam::create([
            'title' => 'Ujian Akhir Sertifikasi',
            'slug' => 'ujian-akhir',
            'description' => 'Ujian untuk menguji pemahaman 40 modul.',
            'passing_score' => 70,
            'time_limit_minutes' => 60,
        ]);

        // Tambah soal contoh
        for ($i = 1; $i <= 5; $i++) {
            $q = $exam->questions()->create(['question_text' => "Soal nomor $i mengenai topik Python?", 'points' => 20]);
            for ($j = 1; $j <= 4; $j++) {
                $q->options()->create(['option_text' => "Pilihan $j", 'is_correct' => ($j === 1)]);
            }
        }
    }
}
