# Tech Stack - AutoExpertise

Ce document décrit les technologies utilisées pour le développement de la plateforme de mise en relation AutoExpertise.

## 1. Frontend

L'interface utilisateur (Client, Expert et Administrateur) est construite comme un Single Page Application (SPA).

- **Framework Core** : React 19 (`react`, `react-dom`)
- **Outil de Build** : Vite 7 (`vite`, `@vitejs/plugin-react`)
- **Routage** : React Router DOM 7 (`react-router-dom`)
- **Styling & UI** :
  - **CSS Framework** : Tailwind CSS 4 (`@tailwindcss/vite`, `tailwindcss`)
  - **Icônes** : Lucide React (`lucide-react`)
- **Requêtes HTTP** : Axios 1.13 (`axios`)
- **Manipulation de Dates** : date-fns 4 (`date-fns`)
- **Code Quality** : ESLint 9

## 2. Backend

L'API de la plateforme est développée via un framework robuste assurant sécurité et modularité.

- **Langage** : PHP 8.2+
- **Framework Core** : Laravel 12 (`laravel/framework`)
- **Authentification & Sécurité** : Laravel Sanctum 4 (`laravel/sanctum`) pour l'authentification par tokens (SPA / API).
- **Tests** : PHPUnit 11 & Pest (disponible via alias)
- **Base de Données (Par défaut)** : SQLite (Environnement de développement via `database.sqlite`), adaptable vers MySQL / PostgreSQL via Eloquent ORM.

## 3. Communication Client/Serveur

1. Le Frontend (Vite/React) consomme l'API Backend (Laravel).
2. Toutes les requêtes sensibles sont protégées par le système **Sanctum** pour vérifier l'identité de l'utilisateur (Clients, Experts ou Administrateurs).
3. Le routage côté Frontend filtre l'accès aux pages selon le rôle récupéré depuis le Backend.

## 4. Outils de Développement et Commandes Utiles

- **Démarrage Frontend** : `npm run dev` (Démarrera le serveur Vite).
- **Démarrage Backend** : `php artisan serve` pour l'API.

*(L'architecture garantit des performances de haut niveau pour l'application avec un focus sur une excellente expérience utilisateur (UI/UX))*
