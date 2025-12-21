# Journal des Modifications (Changelog)

Toutes les modifications notables du projet **TravelDB** seront documentées dans ce fichier.

## [2.0.0] - 2025-12-21

### Refonte graphique

- **UI/UX** : Redesign complet "Document de Voyage" (Billet d'avion, Passeport).
- **Immersion** : Vidéo dynamique sur la page d'accueil invité, animations fluides.
- **Thèmes & Accessibilité** :
  - **Dark Mode** : Support complet avec inversion intelligente des logos (Noir/Blanc).
  - **Lisibilité** : Fonds solides unifiés pour une clarté optimale.
  - **Branding** : Harmonisation des polices (Manuscrite), icônes et couleurs (Palette Slate).

## [1.5.0] - 2025-12-07

### Ajouté

- **Modification de Visite** : Possibilité pour l’utilisateur de modifier la date d’une visite existante.
- **Suppression de Visite** : Implémentation complète de la suppression (flux UX/UI et API).

### Modifié

- **UX Connexion** :
  - Le lien « Mot de passe oublié ? » a été déplacé sous le champ mot de passe pour une meilleure ergonomie (Tab Order : Email -> Password -> Forgot).

### Corrigé

- **Erreurs de Connexion** : Affichage d’un message clair en cas d'identifiants incorrects (au lieu d'une erreur générique).

## [1.4.0] - 2025-11-25

### Réinitialisation de Mot de Passe

- **Backend** :
  - Nouvelle table/colonnes (`reset_token`, `reset_token_expires_at`).
  - Routes API sécurisées pour la génération et validation de tokens (expiration 1h).
  - Email transactionnel avec lien magique.
- **Frontend** :
  - Pages `ForgotPassword.vue` (Demande) et `ResetPassword.vue` (Nouveau mot de passe).
  - Vérification automatique de la validité du lien au chargement.

## [1.3.0] - 2025-11-15

### Sécurité & Vérification

- **Validation d'Email** :
  - Envoi d'un lien signé à l'inscription.
  - Blocage de la connexion si l'email n'est pas vérifié.
- **Rate Limiting** : Protection des routes sensibles (1 envoi/min pour les emails).

## [1.2.1] - 2025-11-10

### Fonctionnalités Majeures

- **Visites Multiples** : Possibilité d'ajouter plusieurs visites pour un même pays.
- **Détails Pays** : Nouveau composant listant l'historique des visites par pays.
- **Interactivité Carte** : Popup au clic sur un pays visité.

### Interface & Thèmes

- **Mode Sombre/Clair** : Introduction du thème dynamique.
- **Logos** : Intégration des logos officiels TravelDB.

## [1.1.0] - 2025-11-05

### Légal & Structure

- **Pages Légales** : Ajout de la Politique de Confidentialité et des Mentions Légales.
- **Footer Sticky** : Pied de page persistant et responsive.
- **Layout** : Refonte de la structure principale (`App.vue`) pour un meilleur positionnement.

## [1.0.0] - 2025-11-02

### Lancement Initial

- **Carte Interactive** : Visualisation monde (Leaflet + GeoJSON).
- **Compte Utilisateur** : Inscription, Connexion, Gestion de session sécurisée.
- **Base de Données** : Mysql + AdonisJS pour le stockage robuste.
- **Frontend** : Vue.js 3 + Pinia pour une expérience fluide.
