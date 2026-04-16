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
                    'bio'       => 'Expert automobile spécialisé dans l’analyse des accidents de la route. Il évalue les dommages des véhicules, détermine les causes techniques des collisions.',
                    'photo_url' => 'http://localhost:8001/expert_karim.png',
                    'qualifications' => "Diplôme d'État d'Expert Automobile (DEEA)\nCertification technique supérieure",
                    'experience' => "15 ans d'expérience en cabinet d'expertise indépendant\nExpert auprès des tribunaux depuis 2015",
                    'services' => "Analyse de collision\nÉvaluation de dommages\nRapport d'expertise juridique",
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
                    'bio'       => 'Experte en estimation des dégâts matériels sur véhicules après accident. Elle intervient pour calculer les coûts de réparation.',
                    'photo_url' => 'http://localhost:8001/expert_nadia.png',
                    'qualifications' => "Licence Professionnelle Maintenance des Systèmes\nSpécialisation Estimation de dommage",
                    'experience' => "8 ans au sein d'une grande compagnie d'assurance\nSpécialiste de la valeur résiduelle",
                    'services' => "Estimation de réparation\nValorisation de véhicule\nSuivi de travaux en garage",
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
                    'bio'       => 'Ingénieur mécanique spécialisé dans l’analyse technique des pannes automobiles. Il identifie les défaillances mécaniques.',
                    'photo_url' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=256&h=256',
                    'qualifications' => "Ingénieur en Génie Mécanique\nCertification Maître Artisan mécanicien",
                    'experience' => "Ancien Chef d'Atelier chez BMW\nSpécialiste des transmissions intégrales",
                    'services' => "Diagnostic panne complexe\nExpertise moteur\nAnalyse d'huiles et fluides",
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
                    'bio'       => 'Spécialiste dans l’évaluation complète des véhicules gravement accidentés. Elle détermine si le véhicule est réparable.',
                    'photo_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
                    'qualifications' => "Expert Agréé Sécurité Routière\nSpécialisation structure et châssis",
                    'experience' => "Formatrice en réparation carrosserie\nAudit de sécurité pour constructeurs",
                    'services' => "Vérification de châssis\nContrôle de géométrie laser\nCertification de remise en circulation",
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
                    'bio'       => 'Expert en systèmes électroniques des véhicules modernes. Il réalise des diagnostics avancés sur les calculateurs.',
                    'photo_url' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
                    'qualifications' => "Expertise Électronique Embarquée\nCertification Systèmes Hybrides & Électriques",
                    'experience' => "Développeur de solutions de diagnostic\nConsultant pour flottes logistiques",
                    'services' => "Réinitialisation calculateurs\nRecherche de pannes électriques\nAudit systèmes ADAS",
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
                    'bio'       => 'Experte dans l’inspection technique des véhicules d’occasion. Elle vérifie l’état général du véhicule.',
                    'photo_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
                    'qualifications' => "Technicien Supérieur Automobile\nExpertise Valeur de Marché",
                    'experience' => "Responsable de parc automobile\nAncienne contrôleuse technique",
                    'services' => "Bilan complet avant achat\nVérification historique entretien\nEstimation prix de revente",
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