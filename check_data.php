<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo 'courses=' . App\Models\Course::count() . PHP_EOL;
echo 'modules=' . App\Models\CourseModule::count() . PHP_EOL;
echo 'exams=' . App\Models\CertificationExam::count() . PHP_EOL;
echo 'questions=' . App\Models\ExamQuestion::count() . PHP_EOL;
echo 'options=' . App\Models\ExamOption::count() . PHP_EOL;
