# Product Requirements Document (PRD) - AutoExpertise

## 1. Introduction
**Nom du projet :** AutoExpertise
**Objectif :** Créer une plateforme de mise en relation sécurisée et modulaire entre des clients ayant besoin d'une expertise et des experts qualifiés. La plateforme permet de gérer les rendez-vous, les disponibilités, et de maintenir une modération rigoureuse des profils et des avis via une interface d'administration avancée.

## 2. Rôles et Utilisateurs
La plateforme identifie 3 types d'acteurs principaux :
1. **Client** : Cherche et réserve des sessions avec un expert, consulte son historique et gère ses réservations.
2. **Expert** : Propose ses services, gère ses disponibilités et accepte/honore les réservations.
3. **Administrateur** : Modère la plateforme, valide l'inscription des experts, gère les utilisateurs et supervise l'activité globale.

---

## 3. Fonctionnalités Principales

### 3.1. Espace Client (Client Phase)
- **Inscription & Authentification** : Création de compte client avec validation.
- **Tableau de Bord Client** :
  - **Recherche d'Experts** : Filtrer et chercher un expert qualifié.
  - **Prise de Rendez-vous (`ManageReservation`)** : Créer, modifier ou annuler une réservation.
  - **Historique (`BookingHistory`)** : Voir les rendez-vous passés et à venir.
  - **Dépôt d'Avis** : Pouvoir laisser un avis après une expertise.

### 3.2. Espace Expert (Expert Phase)
- **Inscription & Onboarding** : L'inscription d'un expert est soumise à la validation de l'administrateur.
- **Tableau de Bord Expert** :
  - **Gestion des Disponibilités (`AvailabilitiesManager`)** : Définir les créneaux horaires disponibles.
  - **Gestion des Demandes** : Accepter, reporter ou refuser les demandes de réservation des clients.
  - **Profil Public** : Renseigner son domaine d'expertise, sa biographie et afficher ses avis.

### 3.3. Espace Administrateur (Admin Phase)
- **Tableau de Bord "Midnight Indigo"** : Interface premium et différenciée avec un thème sombre (Midnight Indigo) pour l'administration.
- **Modération & Gestion (`AdminLayout`)** :
  - **Validation des Experts** : Approuver ou rejeter les nouveaux profils experts.
  - **Gestion des Utilisateurs** : Voir, bloquer ou bannir des clients ou experts.
  - **Modération des Avis** : Surveiller et supprimer les avis ne respectant pas les CGU.
  - **Statistiques Globales** : Vue sur l'activité (nombres de réservations, inscriptions, etc.).

---

## 4. Spécifications Techniques Minimales

### 4.1. Architecture
- **Frontend** : React.js, Routage protégé (Role-based routing).
- **Backend** : Framework API REST (Ex: Laravel), authentification via tokens (ex: Laravel Sanctum).
- **Base de Données** : Relationnelle (utilisant le database seeding et des migrations structurées).

### 4.2. UI/UX
- **Expérience Utilisateur** : Routage fluide entre les trois rôles clés. Les interfaces doivent être responsives et inclure des micro-animations.
- **Thèmes de la plateforme** : 
  - Standard, clair et accessible pour Clients et Experts.
  - Thème spécifique "Midnight Indigo" pour la zone Administrateur garantissant un design percutant et différencié. 

### 4.3. Sécurité
- Middleware de vérification des rôles.
- Protection contre les failles courantes (CSRF, XSS).
- Mots de passe hashés, gestion robuste des tokens (erreur de réseau/authentification).

## 5. Critères d'Acceptation (MVP)
- [x] Les 3 rôles peuvent s'inscrire, se connecter et sont redirigés vers leur Dashboard respectif.
- [x] Un expert peut ajouter ses disponibilités et un client peut réserver un créneau valide.
- [x] L'administrateur peut bannir un utilisateur et valider un expert en attente.
- [x] La plateforme tourne de manière sécurisée en API mode, sans erreurs CORS ou "Network Error" à la création de compte.
