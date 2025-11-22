# 🌍 TravelDB

TravelDB est une application web permettant de suivre les pays que vous avez visités.
Elle propose une carte interactive basée sur Leaflet, un système d’authentification sécurisé avec sessions (AdonisJS), et une interface simple en Vue 3.

---

## ✨ Fonctionnalités principales

### 🧭 Carte interactive

- Affichage du monde en GeoJSON
- Pays visités colorés automatiquement en vert
- Mise à jour en temps réel après ajout d’un pays
- Stockage des visites par utilisateur

### 📝 Journal des visites

- Ajout d’un pays visité via un formulaire intelligent :
  - autocomplétion des pays (FR)
  - validation de la date (facultative)
  - blocage des dates futures
  - exclusion des pays déjà visités

- Stockage en base MySQL avec contrainte unique par utilisateur

### 🔐 Authentification (sessions)

- Login / Register via AdonisJS 6
- Sessions sécurisées via cookies HTTPOnly
- Route `/auth/me` pour récupérer l’utilisateur connecté
- Redirection automatique des pages Login/Register si déjà connecté

### 🗃 Stockage centralisé via Pinia

- Store `auth` pour la session
- Store `visits` pour synchroniser la carte et le formulaire
- Vue réactive : tout se met à jour automatiquement

---

## 🚀 Stack technique

### Backend

- **AdonisJS 6**
- Sessions via cookies
- VineJS pour validation serveur
- Lucid ORM (MySQL)
- Structure MVC claire
- Protection CSRF/CORS avec `withCredentials: true`

### Frontend

- **Vue.js 3**
- Pinia (auth + visits)
- Vue Router (route guard)
- Leaflet pour la carte
- Bootstrap 5 + bootstrap-vue-next
- Axios (instance centralisée)
- Vite pour le développement

---

## 📦 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/fbrend23/TravelDB.git
cd TravelDB
```

---

## ⚙ Backend — Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Copier le fichier d’environnement

```bash
cp backend/.env.example backend/.env
```

### 3. Configurer `.env`

Exemple :

```env
PORT=3333
HOST=0.0.0.0

SESSION_DRIVER=cookie
SESSION_SECRET=yourRandomSecretHere

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_DATABASE=
```

### 4. Lancer les migrations

```bash
npm --workspace backend run migrate
```

---

## 🎨 Frontend — Installation

### 1. Créer `/frontend/.env`

```env
VITE_API_URL=http://localhost:3333
```

### 2. Installer les dépendances

```bash
npm install
```

---

## ▶ Lancer l’application

Depuis la racine du projet :

```bash
npm run dev
```

Cela lance :

- **Backend** AdonisJS sur : [http://localhost:3333](http://localhost:3333)
- **Frontend** Vue sur : [http://localhost:5173](http://localhost:5173)

---

## 🛠 Structure du projet

```text
TravelDB/
 ├─ backend/
 │   ├─ app/
 │   │   ├─ controllers/
 │   │   ├─ models/
 │   │   ├─ validators/
 │   │   └─ ...
 │   ├─ config/
 │   ├─ database/
 │   └─ start/
 │
 ├─ frontend/
 │   ├─ src/
 │   │   ├─ api/
 │   │   ├─ components/
 │   │   ├─ stores/
 │   │   ├─ pages/
 │   │   └─ router/
 │   └─ public/
 │       └─ countries.geo.json
 │
 └─ .github/workflows/
```

---

## 🔒 Sécurité & Validation

### Côté Backend (VineJS)

- Email unique
- Username unique, alphanum, 3–32 caractères
- Mot de passe min 8 caractères
- Pays ISO3 validé via regex + transformation uppercase
- Date :
  - accepte `YYYY-MM` ou `YYYY-MM-DD`
  - défaut : premier jour du mois

### Côté Frontend

- Validation des champs avant soumission
- Blocage des pays déjà visités
- Traduction en français des messages d’erreur VineJS

---

## 📄 Licence

Ce projet est sous licence **MIT**.

---

Pour toute contribution ou bug, ouvrez une issue sur GitHub.
