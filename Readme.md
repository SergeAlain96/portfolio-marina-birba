# Cahier des Charges – Portfolio Professionnel de Marina Birba

## Informations du Projet

### Nom du projet

Portfolio Professionnel de Marina Birba

### Objectif

Concevoir un portfolio web moderne, élégant et administrable permettant à Marina Birba de présenter son parcours académique, ses expériences professionnelles, ses compétences en géomatique ainsi que ses projets SIG.

Le site devra être entièrement modifiable via une interface d'administration sécurisée sans nécessiter de modification du code source.

---

# Stack Technique

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* React Icons
* Framer Motion

## Backend

* Supabase

## Base de données

* PostgreSQL (Supabase)

## Authentification

* Supabase Auth

## Hébergement

* Vercel

## Stockage

* Supabase Storage

---

# Fonctionnalités Principales

## Site Public

### Accueil

Affichage :

* Photo professionnelle
* Nom complet
* Métier
* Présentation courte
* Bouton Télécharger CV
* Bouton Contact

---

### À Propos

Contient :

* Présentation détaillée
* Parcours professionnel
* Vision professionnelle
* Domaines d'expertise

---

### Expériences Professionnelles

Affichage chronologique des expériences :

* Poste
* Structure
* Localisation
* Date
* Missions réalisées

---

### Formations

Affichage :

* Diplôme
* Établissement
* Pays
* Année

---

### Compétences

Organisation par catégories :

#### SIG

* QGIS
* ArcGIS Pro

#### Télédétection

* ENVI
* Geomatica

#### Collecte de données

* GPS
* Kobo Collect

#### Analyse spatiale

* Analyse multicritère
* AHP

#### Bureautique

* Word
* Excel
* PowerPoint

---

### Projets

Chaque projet doit contenir :

* Titre
* Description
* Images
* Technologies utilisées
* Date
* Bouton Voir le projet

---

### Contact

Formulaire :

* Nom
* Email
* Sujet
* Message

Informations :

* Téléphone
* Email
* LinkedIn

---

# Administration

## Connexion

URL :

```text
/admin
```

Authentification :

* Email
* Mot de passe

---

## Tableau de Bord

L'administratrice pourra :

### Profil

* Modifier la photo
* Modifier le titre professionnel
* Modifier la biographie
* Modifier les informations de contact

### Expériences

* Ajouter
* Modifier
* Supprimer

### Formations

* Ajouter
* Modifier
* Supprimer

### Compétences

* Ajouter
* Modifier
* Supprimer

### Projets

* Ajouter
* Modifier
* Supprimer
* Ajouter plusieurs images

### CV

* Importer un nouveau PDF

---

# Structure de la Base de Données

## profiles

```sql
id UUID PRIMARY KEY
fullname TEXT
title TEXT
bio TEXT
photo_url TEXT
cv_url TEXT
email TEXT
phone TEXT
linkedin TEXT
created_at TIMESTAMP
```

---

## experiences

```sql
id UUID PRIMARY KEY
title TEXT
company TEXT
location TEXT
start_date DATE
end_date DATE
description TEXT
created_at TIMESTAMP
```

---

## education

```sql
id UUID PRIMARY KEY
degree TEXT
institution TEXT
country TEXT
year TEXT
created_at TIMESTAMP
```

---

## skills

```sql
id UUID PRIMARY KEY
name TEXT
category TEXT
created_at TIMESTAMP
```

---

## projects

```sql
id UUID PRIMARY KEY
title TEXT
description TEXT
cover_image TEXT
project_date DATE
created_at TIMESTAMP
```

---

## project_images

```sql
id UUID PRIMARY KEY
project_id UUID
image_url TEXT
created_at TIMESTAMP
```

---

# Architecture du Projet

```text
portfolio-marina/

├── public/
│
├── src/
│
├── assets/
│   ├── images/
│   ├── icons/
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── ProjectCard.jsx
│   ├── SkillCard.jsx
│   ├── ExperienceCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Experience.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│
├── services/
│   ├── supabase.js
│
├── hooks/
│
├── layouts/
│
├── App.jsx
├── main.jsx
│
├── .env
├── package.json
└── README.md
```

---

# Design System

## Concept Visuel

Le portfolio doit inspirer :

* Élégance
* Professionnalisme
* Modernité
* Crédibilité
* Confiance

Le design doit être épuré avec beaucoup d'espace blanc.

---

## Palette de Couleurs

```css
Primary    : #E11D74;
Secondary  : #1E293B;
Accent     : #F9A8D4;
Background : #FFF7FB;
Text       : #334155;
White      : #FFFFFF;
```

### Utilisation

#### Primary

```css
#E11D74
```

Utilisée pour :

* Boutons principaux
* Liens
* Icônes importantes
* Éléments interactifs

---

#### Secondary

```css
#1E293B
```

Utilisée pour :

* Titres
* Navbar
* Footer
* Textes importants

---

#### Accent

```css
#F9A8D4
```

Utilisée pour :

* Badges
* Hover
* Cartes
* Éléments décoratifs

---

#### Background

```css
#FFF7FB
```

Fond principal du site.

---

#### Text

```css
#334155
```

Paragraphes et contenus.

---

# Typographie

## Police Principale

```text
Poppins
```

Poids :

* 400 : Texte normal
* 500 : Sous-titres
* 600 : Boutons
* 700 : Titres

---

# Composants UI

## Bouton Principal

```css
background: #E11D74;
color: white;
border-radius: 12px;
```

---

## Bouton Secondaire

```css
background: transparent;
border: 2px solid #E11D74;
color: #E11D74;
```

---

## Cards

```css
background: white;
border-radius: 16px;
box-shadow: light;
```

---

## Navbar

```css
position: sticky;
top: 0;
backdrop-filter: blur(10px);
```

---

# Responsive Design

## Mobile

* ≤ 768px

## Tablette

* 768px à 1024px

## Desktop

* ≥ 1024px

Le site doit être parfaitement responsive sur tous les appareils.

---

# Animations

Utiliser Framer Motion pour :

* Apparition des sections
* Hover sur les cartes
* Effets sur les boutons
* Transitions de pages

Animations douces et professionnelles.

---

# Optimisation SEO

* Meta Title
* Meta Description
* Open Graph
* Sitemap
* Robots.txt

---

# Déploiement

## Frontend

Vercel

## Backend

Supabase

## Domaine

Exemples :

* marinabirba.com
* marina-bf.com
* marinaportfolio.com

---

# Évolutions Futures

* Version anglaise
* Blog professionnel
* Carte interactive Leaflet
* Galerie cartographique
* Téléchargement de publications scientifiques
* Tableau de statistiques
* Formulaire de recrutement
* Espace téléchargement de cartes

---

# Planning de Développement

## Phase 1

* Création du projet React
* Installation Tailwind CSS
* Configuration Supabase

## Phase 2

* Création de l'interface publique

## Phase 3

* Mise en place de l'authentification

## Phase 4

* Développement du dashboard administrateur

## Phase 5

* Tests et optimisation

## Phase 6

* Déploiement sur Vercel

## Phase 7

* Mise en production
