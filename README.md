# 🐾 Projet Fil Rouge - Pax Canina

## 📝 Description du Projet

**Pax Canina** est une application web destinée à la gestion complète d’un **club canin**, facilitant les interactions entre les propriétaires de chiens, les entraîneurs et les responsables du club. L’objectif est d’offrir une plateforme fluide et intuitive permettant la réservation de cours, la gestion des profils canins et le suivi des progrès.

---

## ⚙️ Fonctionnalités Principales

- 🔐 **Inscription des Propriétaires et des Chiens**  
  Les utilisateurs peuvent créer un compte et enregistrer un ou plusieurs chiens.

- 📅 **Gestion et Réservation des Cours**  
  Les responsables créent des sessions ; les propriétaires réservent en ligne.

- 📊 **Tableaux de Bord Dynamiques**  
  Adaptés aux rôles (propriétaire, entraîneur, responsable) pour une vue personnalisée.

---

## 🧱 Structure du Projet Angular

Le projet suit les conventions **SCAM (Single Component Angular Modules)** pour une meilleure lisibilité, testabilité et évolutivité.

src/
├── app/
│ ├── core/ # Services singleton, modèles, interceptors HTTP
│ │ ├── guards/ # Guards pour protéger les routes
│ │ ├── interceptors/ # Interceptors HTTP (ex. JWT)
│ │ ├── models/ # Modèles de données (ex. User, Dog, Course)
│ │ └── services/ # Services partagés (ex. AuthService, ApiService)
│ ├── shared/ # Composants, pipes et directives réutilisables
│ │ ├── components/ # Composants communs (ex. boutons, cards)
│ │ ├── directives/ # Directives personnalisées
│ │ └── pipes/ # Pipes personnalisées
│ ├── features/ # Modules fonctionnels de l'application
│ │ ├── auth/ # Connexion et inscription
│ │ ├── home/ # Page d'accueil
│ │ ├── dashboard/ # Tableau de bord utilisateur
│ │ ├── calendar/ # Calendrier des cours
│ │ ├── contact/ # Page de contact
│ │ └── profile/ # Profil utilisateur
│ ├── layouts/ # Layouts principaux (header, footer, sidebar)
│ │ └── main-layout/
├── assets/
│ ├── images/
│ ├── icons/
│ └── fonts/

---

## 🧰 Technologies Utilisées

| Partie          | Technologie                    |
| --------------- | ------------------------------ |
| Frontend        | Angular 19                     |
| Backend         | Spring Boot 3                  |
| Base de données | MySQL                          |
| ORM             | Hibernate (Spring Data JPA)    |
| Autres outils   | Git, Maven, Docker (optionnel) |

---

## 🚀 Bonnes Pratiques Suivies

✅ Architecture modulaire **SCAM**  
✅ Séparation claire des responsabilités (`core`, `shared`, `features`, `layouts`)  
✅ Structure prête pour la **scalabilité**  
✅ Suivi des conventions de nommage Angular et Spring  
✅ Mise en production facilitée (**préparation Docker-ready**)

---

## 📌 Auteur

**Flavio Terenzi**  
🎓 Projet réalisé dans le cadre de la formation **Concepteur Développeur d’Applications (CDA)** à **Metz Numeric School – 2025**
