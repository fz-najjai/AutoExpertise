<?php
echo "\n--- DB STATS ---\n";
echo "Users: " . \App\Models\User::count() . "\n";
echo "Experts: " . \App\Models\ExpertProfile::count() . "\n";
echo "Appointments: " . \App\Models\Appointment::count() . "\n";
echo "----------------\n";
