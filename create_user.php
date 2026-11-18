<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::firstOrCreate(
    ['email' => 'admin@cendiks.com'],
    [
        'name' => 'Admin Cendiks',
        'password' => Illuminate\Support\Facades\Hash::make('password123'),
        'email_verified_at' => now(),
    ]
);

echo 'User: ' . $user->email . PHP_EOL;
echo 'Password: password123' . PHP_EOL;
