<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ExpertProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ExpertSeeder extends Seeder
{
    public function run(): void
    {
        $experts = [
            [
                'user' => [
                    'name'         => 'Karim Kadiri',
                    'email'        => 'karim.kadiri@expert.com',
                    'password'     => Hash::make('password'),
                    'role'         => 'expert',
                    'city'         => 'Casablanca',
                    'is_validated' => true,
                ],
                'profile' => [
                    'specialty' => 'Expertise des accidents automobiles',
                    'price'     => 500.00,
                    'bio'       => 'Expert automobile spécialisé dans l’analyse des accidents de la route. Il évalue les dommages des véhicules, détermine les causes techniques des collisions et rédige des rapports détaillés pour les assurances et les tribunaux.',
                    'photo_url' => 'https://randomuser.me/api/portraits/men/32.jpg',
                ],
            ],
            [
                'user' => [
                    'name'         => 'Nadia El Fassi',
                    'email'        => 'nadia.elfassi@expert.com',
                    'password'     => Hash::make('password'),
                    'role'         => 'expert',
                    'city'         => 'Rabat',
                    'is_validated' => true,
                ],
                'profile' => [
                    'specialty' => 'Évaluation des dommages automobiles',
                    'price'     => 350.00,
                    'bio'       => 'Experte en estimation des dégâts matériels sur véhicules après accident. Elle intervient pour calculer les coûts de réparation, déterminer la valeur du véhicule et assister les compagnies d’assurance.',
                    'photo_url' => 'https://randomuser.me/api/portraits/women/44.jpg',
                ],
            ],
            [
                'user' => [
                    'name'         => 'Youssef Alami',
                    'email'        => 'youssef.alami@expert.com',
                    'password'     => Hash::make('password'),
                    'role'         => 'expert',
                    'city'         => 'Marrakech',
                    'is_validated' => true,
                ],
                'profile' => [
                    'specialty' => 'Expertise mécanique automobile',
                    'price'     => 400.00,
                    'bio'       => 'Ingénieur mécanique spécialisé dans l’analyse technique des pannes automobiles. Il identifie les défaillances mécaniques, évalue l’état du moteur et des composants critiques des véhicules.',
                    'photo_url' => 'https://randomuser.me/api/portraits/men/55.jpg',
                ],
            ],
            [
                'user' => [
                    'name'         => 'Samira Tahiri',
                    'email'        => 'samira.tahiri@expert.com',
                    'password'     => Hash::make('password'),
                    'role'         => 'expert',
                    'city'         => 'Fès',
                    'is_validated' => true,
                ],
                'profile' => [
                    'specialty' => 'Expertise des véhicules accidentés',
                    'price'     => 600.00,
                    'bio'       => 'Spécialiste dans l’évaluation complète des véhicules gravement accidentés. Elle détermine si le véhicule est réparable ou classé économiquement irréparable et fournit un rapport technique détaillé.',
                    'photo_url' => 'https://randomuser.me/api/portraits/women/68.jpg',
                ],
            ],
            [
                'user' => [
                    'name'         => 'Rachid Ouazzani',
                    'email'        => 'rachid.ouazzani@expert.com',
                    'password'     => Hash::make('password'),
                    'role'         => 'expert',
                    'city'         => 'Tanger',
                    'is_validated' => true,
                ],
                'profile' => [
                    'specialty' => 'Diagnostic électronique automobile',
                    'price'     => 450.00,
                    'bio'       => 'Expert en systèmes électroniques des véhicules modernes. Il réalise des diagnostics avancés sur les calculateurs, capteurs et systèmes embarqués pour détecter les anomalies techniques.',
                    'photo_url' => 'https://randomuser.me/api/portraits/men/77.jpg',
                ],
            ],
            [
                'user' => [
                    'name'         => 'Fatima Bensouda',
                    'email'        => 'fatima.bensouda@expert.com',
                    'password'     => Hash::make('password'),
                    'role'         => 'expert',
                    'city'         => 'Agadir',
                    'is_validated' => true,
                ],
                'profile' => [
                    'specialty' => 'Inspection et estimation de véhicules d’occasion',
                    'price'     => 300.00,
                    'bio'       => 'Experte dans l’inspection technique des véhicules d’occasion. Elle vérifie l’état général du véhicule, détecte les réparations cachées et estime la valeur réelle du véhicule sur le marché.',
                    'photo_url' => 'https://randomuser.me/api/portraits/women/91.jpg',
                ],
            ],
        ];

        $emails = array_column(array_column($experts, 'user'), 'email');
        User::whereIn('email', $emails)->delete();

        foreach ($experts as $data) {
            $user = User::create($data['user']);
            ExpertProfile::create(array_merge(['user_id' => $user->id], $data['profile']));
        }

        $this->command->info('✅ ' . count($experts) . ' experts créés avec succès !');
    }
}