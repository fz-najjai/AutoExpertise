<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
try {
    echo "Creating user...\n";
    $email = 'token'.time().'@test.com';
    $user = User::create([
        'name' => 'Token Test',
        'email' => $email,
        'password' => 'password',
        'role' => 'client',
        'city' => 'Test',
        'is_validated' => true
    ]);
    echo "User created with ID: " . $user->id . "\n";
    echo "Attempting to create token for user " . $user->id . "...\n";
    $token = $user->createToken('test_token');
    echo "Token object created.\n";
    echo "Plain text token: " . $token->plainTextToken . "\n";
    echo "Success!\n";
} catch (\Throwable $e) {
    echo "CRITICAL ERROR: " . $e->getMessage() . "\n";
    echo "FILE: " . $e->getFile() . " LINE: " . $e->getLine() . "\n";
    echo "TRACE: " . $e->getTraceAsString() . "\n";
}
