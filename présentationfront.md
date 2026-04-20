---
marp: true
theme: default
class: 
  - lead
  - invert
style: |
  section {
    background-color: #0f172a;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
  }
  h1, h2, h3, h4 { color: #38bdf8; }
  .highlight { color: #818cf8; font-weight: bold; }
---

# 🚗 AutoExpertise
## Plateforme Digitale d'Expertise Automobile
### Soutenance de Projet Ingénieur - Focus Frontend

---

# 🎯 Introduction
**L'Innovation au Service de l'Expertise**

- **Projet :** Digitalisation du processus d'expertise automobile.
- **Objectif UI/UX :** Offrir une expérience fluide, intuitive et rassurante pour les clients tout en fournissant des outils puissants aux experts.
- **Approche :** Interface moderne, réactive et centrée sur l'utilisateur.

---

# 🛠️ Technologies Frontend Utilisées
**Stack Moderne & Performante**

- **Framework Core :** React.js (Vite)
- **Styling :** Tailwind CSS 4 (Utility-first, responsive design)
- **Icônes & UI :** Lucide React (Design épuré et professionnel)
- **Routing :** React Router DOM v7 (Navigation SPA fluide)
- **Temps Réel :** Laravel Echo & Pusher-js (Websockets)
- **Data Viz / Calendrier :** Chart.js & FullCalendar

---

# 🏗️ Architecture Frontend
**Modulaire & Évolutive**

```text
src/
 ├── assets/          # Ressources statiques et styles globaux
 ├── components/      # Composants réutilisables (Navbar, Cards, Modals...)
 ├── layouts/         # Structures de pages conteneurs (Auth, Dashboards...)
 ├── pages/           # Vues spécifiques (Home, Admin, Expert, Client...)
 ├── services/        # Appels API (Axios configuré) et logique externe
 ├── context/         # Gestion d'état global (AuthContext...)
 └── utils/           # Fonctions utilitaires, formatage
```
*Garantit une maintenabilité et une séparation des préoccupations (Clean Code).*

---

# 🎨 Design UI/UX
**Esthétique & Ergonomie (Glassmorphism & Dark Mode)**

- **Identité Visuelle :** Teintes bleutées (Confiance, Sécurité) avec touches vibrantes (Cyan/Indigo pour les Calls to Action).
- **Typographie :** Sans-serif moderne assurant une lisibilité maximale.
- **Responsive Design :** Ajustement parfait du smartphone (Menu Drawer, Stacks) au desktop (Sidebar, Grilles étendues).
- **Micro-interactions :** Effets de hover fluides (Tailwind transitions), animations d'apparition.
- **Accessibilité :** Fort contraste pour la lecture, repères visuels clairs.

---

# 🏠 Home Page
**La Première Impression Compte**

- **Fonctionnel :** Présentation claire de la plateforme, de la carte d'experts aux avantages du service.
- **Design :** Hero section avec visuels forts, effet Glassmorphism (verre poli) sur les cartes descriptives.
- **UX :** Accès direct aux points stratégiques (Trouver un expert, S'inscrire).

*(📸 C'EST ICI LE MOMENT POUR AFFICHER LA MAQUETTE / SCREENSHOT DE LA HOME)*

---

# 🔐 Login / Register
**Sécurité & Simplicité**

- **Fonctionnel :** Processus d'authentification et distinction des rôles lors de l'onboarding (Client vs Expert).
- **Design :** Formulaires épurés centrés, fond soigné, minimisant les distractions.
- **UX :** Validation des champs interactive, messages d'erreur en ligne, indication de la force du mot de passe.

*(📸 AFFICHER LE SCREENSHOT DU FORMULAIRE DE CONNEXION)*

---

# 📊 Dashboard Client
**Suivi & Transparence**

- **Fonctionnel :** Suivi de l'évolution des expertises en temps réel.
- **Design :** Cartes de Key Performance Indicators (KPIs), listes aérées avec badges de statuts colorés (En cours, Terminé).
- **UX :** Navigation simplifiée, bouton d'action principal (Nouveau Dossier) mis en évidence.

*(📸 AFFICHER LE SCREENSHOT DU DASHBOARD CLIENT)*

---

# 👨‍🔧 Dashboard Expert
**Efficacité & Organisation**

- **Fonctionnel :** Centre de commandes personnel. Vue sur les missions, gestion des disponibilités.
- **Design :** Agencement orienté productivité. Sidebar permanente, intégration de "FullCalendar" pour l'agenda.
- **UX :** Notifications push en temps réel, accès rapide au détail des dossiers sinistres.

*(📸 AFFICHER LE SCREENSHOT DU DASHBOARD EXPERT)*

---

# 👑 Dashboard Admin
**Contrôle Central & Validation**

- **Fonctionnel :** Tour de contrôle du système (Approbation des comptes experts, surveillance de l'activité).
- **Design :** Tableaux de bord denses mais lisibles. Graphiques interactifs (Chart.js), tables de données complètes.
- **UX :** Modales de confirmation pour les actions critiques (Refus / Validation avec justification).

*(📸 AFFICHER LE SCREENSHOT DU DASHBOARD ADMINISTRATEUR)*

---

# 📝 Page de Demande d'Expertise
**Création Intuitive de Dossier**

- **Fonctionnel :** Interface de déclaration du sinistre par le client.
- **Design :** Formulaire découpé en étapes (Wizard progressif), réduisant la charge cognitive.
- **UX :** Téléchargement de documents et photos en glisser-déposer (Drag & Drop), feedback sur le traitement.

*(📸 AFFICHER LE SCREENSHOT DU FORMULAIRE DE DEMANDE)*

---

# 📋 Liste des Expertises & Carte
**Trouver le Bon Expert**

- **Fonctionnel :** Recherche géolocalisée et filtrage des experts automobiles de la plateforme.
- **Design :** Vue mi-carte latérale (Maps) / mi-liste de profils cards.
- **UX :** Survol des points sur la carte qui éclaire la carte du profil correspondant (Interaction bidirectionnelle).

*(📸 AFFICHER LE SCREENSHOT DE LA VUE CARTE / LISTE EXPERTS)*

---

# 👤 Profil Utilisateur
**Gestion d'Identité & Sécurité**

- **Fonctionnel :** Gestion du compte, paramètres de sécurité (changement de mot de passe) et préférences.
- **Design :** Interface divisée en onglets ou sections latérales claires.
- **UX :** Sauvegarde des modifications sans rechargement de la page avec un "Toast" de notification (Succès/Erreur).

*(📸 AFFICHER LE SCREENSHOT DE LA PAGE PROFIL UTILISATEUR)*

---

# 🧱 Composants Clés (UI Kit)
**L'ADN Visuel de la Plateforme**

- **Navbar & Sidebar :** Éléments d'orientation, menus rétractables, menu utilisateur déroulant.
- **Cards (Cartes) :** Pour harmoniser la présentation (Un expert = Une carte, Un dossier = Une carte).
- **Modals (Fenêtres modales) :** Pour les formulaires rapides, validations, paiements (intégration Stripe).
- **Forms & Inputs :** Boutons avec état de chargement dynamique (Spinner), champs avec icônes (Lucide).

---

# ⚙️ Mécanique & Fonctionnalités
**La Logique Sous-Jacente du Frontend**

- **Routage Sécurisé :** Composants `ProtectedRoute` empéchant l'accès direct aux URLs non autorisées.
- **Gestion des États :** Hooks natifs (`useState`, `useReducer`) et Context API pour une synchronisation fluide.
- **Communication Asynchrone :** Service API (Axios avec intercepteurs pour intégration du Token JWT), rendant l'interface indépendante de la latence du backend.

---

# ✨ Expérience Utilisateur (UX)
**Focus sur la Satisfaction Finale**

- **Fluidité (SPA) :** Zéro rechargement complet de la page grâce au Virtual DOM de React.
- **Feedback Immédiat :**
  - Squelettes de chargement (Skeletons) qui préservent l'architecture visuelle en attendant les données.
  - Notifications contextuelles alertant l'utilisateur de l'issue de ses actions.
- **Simplicité :** Un principe directeur "Don't Make Me Think", minimisant les étapes pour arriver au résultat.

---

# 💡 Démonstration Visuelle
*(À PRÉVOIR : Une capsule vidéo, un GIF ou un slide animé montrant des intéractions clés)*

- Animation de la Sidebar.
- Saisie et erreurs de formulaire d'inscription en direct.
- Ouverture temporelle d'une fenêtre de communication en temps réel (Chat).

---

# 🏁 Conclusion
**Bilan du Développement Frontend**

- **Points Forts :** Architecture UI/UX robuste et moderne, composants ultra-réutilisables, design répondant parfaitement aux standards SaaS.
- **Perspectives d'Amélioration :**
  - Implémentation du mode purement Hors-Ligne (PWA - Progressive Web App).
  - Écriture de tests End-to-End automatisés de l'interface (ex: Cypress/Playwright).
  - Intégration de thèmes personnalisables par l'utilisateur final.

---

<center>
<h1>🙏 Merci de votre attention</h1>
<br>
<h3 style="color: #cbd5e1;">Avez-vous des questions ?</h3>
</center>

---
