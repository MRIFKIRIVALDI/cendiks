<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    (new Database\Seeders\CendiksSeeder())->run();
    echo "SEED OK\n";
} catch (\Throwable $e) {
    echo "SEED FAIL: " . $e::class . ": " . $e->getMessage() . "\n";
    echo $e->getFile() . ':' . $e->getLine() . "\n";
}

echo 'courses=' . App\Models\Course::count() . PHP_EOL;
echo 'modules=' . App\Models\CourseModule::count() . PHP_EOL;
echo 'exams=' . App\Models\CertificationExam::count() . PHP_EOL;
