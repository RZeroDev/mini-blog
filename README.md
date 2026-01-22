# 🎨 Mini Blog - Frontend

Application web moderne de blog développée avec React, TypeScript, Vite, et Tailwind CSS.

---

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité](#sécurité)
- [Pipeline CI/CD](#pipeline-cicd)
- [Déploiement](#déploiement)

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git**

---

## 📦 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-organisation/cyberincub.git
cd cyberincub/mini-blog
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Vérifier l'installation

```bash
npm run build
```

Si le build réussit, vous êtes prêt à continuer ! ✅

---

## ⚙️ Configuration

### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet :

```bash
touch .env
```

### 2. Configurer les variables d'environnement

Ajoutez la configuration suivante dans `.env` :

```env
# URL de l'API backend
VITE_API_URL=http://localhost:4000/

# Environnement
VITE_NODE_ENV=development

# Configuration optionnelle
VITE_APP_NAME="Mini Blog"
VITE_APP_VERSION="1.0.0"
```

### Configuration selon l'environnement

#### Développement local

```env
VITE_API_URL=http://localhost:4000/
```

#### Production

```env
VITE_API_URL=https://votre-api.onrender.com/
```

---

## 🚀 Lancement

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

### Mode production (local)

```bash
# Build
npm run build

# Preview du build
npm run preview
```

L'aperçu sera accessible sur : **http://localhost:4173**

---

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Compiler pour la production |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Vérifier le code (ESLint) |
| `npm run type-check` | Vérifier les types TypeScript |

### Scripts de développement

```bash
# Développement avec hot reload
npm run dev

# Build avec analyse du bundle
npm run build -- --report

# Nettoyer le cache et reconstruire
rm -rf node_modules .vite dist
npm install
npm run build
```

---

## 📁 Structure du projet

```
mini-blog/
├── public/                    # Fichiers publics statiques
│   └── vite.svg              # Favicon
├── src/
│   ├── api/                  # Services API
│   │   ├── index.ts          # Configuration axios
│   │   ├── auth.ts           # API authentification
│   │   ├── posts.ts          # API articles
│   │   ├── categories.ts     # API catégories
│   │   ├── users.ts          # API utilisateurs
│   │   └── logs.ts           # API logs
│   ├── assets/               # Assets (images, fonts, etc.)
│   ├── components/           # Composants réutilisables
│   │   ├── ui/               # Composants Shadcn UI
│   │   ├── Header.tsx        # En-tête du site
│   │   ├── Footer.tsx        # Pied de page
│   │   ├── Layout.tsx        # Layout principal
│   │   ├── app-sidebar.tsx   # Sidebar dashboard
│   │   └── ...
│   ├── hooks/                # Custom hooks React
│   ├── lib/                  # Utilitaires
│   │   └── utils.ts          # Fonctions helper
│   ├── pages/                # Pages de l'application
│   │   ├── HomePage.tsx      # Page d'accueil
│   │   ├── PostDetailPage.tsx # Détail d'un article
│   │   ├── CategoryPage.tsx  # Articles par catégorie
│   │   ├── LoginPage.tsx     # Connexion
│   │   ├── DashboardPage.tsx # Dashboard admin
│   │   ├── PostsPage.tsx     # Gestion articles (admin)
│   │   ├── CategoriesPage.tsx # Gestion catégories (admin)
│   │   ├── UsersPage.tsx     # Gestion utilisateurs (admin)
│   │   ├── LogsPage.tsx      # Logs système (admin)
│   │   └── ...
│   ├── store/                # Redux store
│   │   ├── index.ts          # Configuration store
│   │   ├── hooks.ts          # Typed hooks
│   │   └── slices/           # Redux slices
│   │       └── authSlice.ts  # Slice authentification
│   ├── utils/                # Fonctions utilitaires
│   │   └── sanitize.ts       # Sanitization XSS
│   ├── App.tsx               # Composant racine
│   ├── main.tsx              # Point d'entrée
│   └── index.css             # Styles globaux
├── .env                      # Variables d'environnement (à créer)
├── .snyk                     # Config Snyk (faux positifs)
├── index.html                # Template HTML
├── package.json              # Dépendances npm
├── postcss.config.js         # Config PostCSS
├── tailwind.config.js        # Config Tailwind CSS
├── tsconfig.json             # Config TypeScript
├── vite.config.ts            # Config Vite
└── README.md                 # Ce fichier
```

---

## ✨ Fonctionnalités

### 🌐 Public (Visiteurs)

- ✅ **Page d'accueil** : Grid Pinterest des articles
- ✅ **Détail d'article** : Lecture complète avec sidebar
- ✅ **Catégories** : Filtrage par catégorie
- ✅ **Pagination** : Bouton "Charger plus"
- ✅ **Compteur de vues** : Incrémentation automatique
- ✅ **Design responsive** : Mobile, tablet, desktop
- ✅ **Dark mode** : Thème sombre/clair

### 🔐 Dashboard Admin

- ✅ **Authentification** : JWT avec rôles
- ✅ **Gestion articles** : CRUD complet
- ✅ **Gestion catégories** : CRUD complet
- ✅ **Gestion utilisateurs** : CRUD complet
- ✅ **Statistiques** : Totaux et graphiques
- ✅ **Logs système** : Traçabilité des actions
- ✅ **Upload d'images** : Drag & drop
- ✅ **Éditeur riche** : Markdown/HTML

### 🎨 UI/UX

- ✅ **Composants Shadcn UI** : Accessibles et modernes
- ✅ **Tailwind CSS** : Utility-first CSS
- ✅ **Animations** : Smooth transitions
- ✅ **Toast notifications** : Sonner
- ✅ **Icons** : Tabler Icons
- ✅ **Formulaires** : Formik + Yup validation

---

## 🗺️ Routes

### Routes publiques

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomePage | Page d'accueil |
| `/post/:slug` | PostDetailPage | Détail d'un article |
| `/category/:slug` | CategoryPage | Articles par catégorie |
| `/about` | AboutPage | À propos |
| `/contact` | ContactPage | Contact |
| `/login` | LoginPage | Connexion |

### Routes protégées (admin)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/dashboard` | DashboardPage | Dashboard principal |
| `/dashboard/posts` | PostsPage | Gestion articles |
| `/dashboard/categories` | CategoriesPage | Gestion catégories |
| `/dashboard/users` | UsersPage | Gestion utilisateurs |
| `/dashboard/logs` | LogsPage | Logs système |

### Protection des routes

Les routes dashboard sont protégées par le composant `PrivateRoute` :

```tsx
<PrivateRoute requiredRole="admin">
  <DashboardPage />
</PrivateRoute>
```

---

## 🔒 Sécurité

### Mesures implémentées

#### 1. Protection XSS (Cross-Site Scripting)

✅ **Sanitization avec DOMPurify**

Toutes les données utilisateur sont sanitizées avant affichage :

```typescript
import { sanitizeHTML, sanitizeApiImageUrl } from '@/utils/sanitize';

// Pour le contenu HTML
const cleanContent = sanitizeHTML(post.content);

// Pour les URLs d'images
<img src={sanitizeApiImageUrl(apiUrl, post.image)} />
```

**Référence** : [Snyk Learn - XSS](https://learn.snyk.io/lesson/xss/?ecosystem=javascript)

#### 2. Authentification sécurisée

- ✅ JWT stocké dans Redux + localStorage
- ✅ Token envoyé via headers `Authorization: Bearer`
- ✅ Expiration automatique
- ✅ Déconnexion complète (clear state + storage)

#### 3. Cookies sécurisés

```typescript
// Sidebar cookie avec flags de sécurité
const isSecureContext = window.location.protocol === 'https:';
const secureFlag = isSecureContext ? '; Secure' : '';
document.cookie = `${name}=${value}; path=/; SameSite=Strict${secureFlag}`;
```

#### 4. Validation des données

- ✅ Formik + Yup pour validation côté client
- ✅ TypeScript pour type safety
- ✅ Validation backend en double

#### 5. CORS

Le frontend communique uniquement avec l'API configurée dans `.env` :

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Fonctions de sanitization

#### `sanitizeHTML(html: string)`

Nettoie le contenu HTML pour éviter les injections de scripts :

```typescript
const clean = sanitizeHTML('<script>alert("XSS")</script><p>Hello</p>');
// Résultat: '<p>Hello</p>' (script supprimé)
```

#### `sanitizeImageUrl(url: string)`

Valide et nettoie les URLs d'images :

```typescript
const safe = sanitizeImageUrl('javascript:alert("XSS")');
// Résultat: '' (URL dangereuse rejetée)
```

#### `sanitizeApiImageUrl(baseUrl: string, path: string)`

Combine URL base + path de manière sécurisée :

```typescript
const url = sanitizeApiImageUrl(apiUrl, 'uploads/posts/image.jpg');
// Résultat: 'http://localhost:4000/uploads/posts/image.jpg'
```

---

## 🔄 Pipeline CI/CD

### Vue d'ensemble

Le projet utilise **GitHub Actions** pour l'intégration et le déploiement continus.

### Workflows disponibles

#### 1. CI - Tests & Build (`ci.yml`)

**Déclenchement** : Push sur toutes les branches

**Étapes** :
1. ✅ Checkout du code
2. ✅ Setup Node.js 18
3. ✅ Installation des dépendances
4. ✅ Linting (ESLint)
5. ✅ Type checking (TypeScript)
6. ✅ Build du projet

```yaml
name: CI Frontend
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

#### 2. Security Scan (`security.yml`)

**Déclenchement** : Push, PR, et hebdomadaire

**Étapes** :
1. ✅ npm audit (vulnérabilités connues)
2. ✅ Snyk scan (dépendances + code)
3. ✅ Détection de secrets (GitGuardian, optionnel)

```yaml
name: Security Scan
on:
  push:
  pull_request:
  schedule:
    - cron: '0 0 * * 0' # Dimanche à minuit
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --audit-level=moderate
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

#### 3. Deploy (`deploy.yml`) - Automatique avec Vercel

Vercel déploie automatiquement à chaque push sur `main`.

### Configuration des secrets GitHub

Allez dans **Settings** > **Secrets and variables** > **Actions** :

| Secret | Description |
|--------|-------------|
| `VITE_API_URL` | URL de l'API en production |
| `SNYK_TOKEN` | Token Snyk pour scans de sécurité |
| `VERCEL_TOKEN` | Token Vercel (si déploiement manuel) |

### Badges de statut

Ajoutez ces badges à votre README :

```markdown
![CI](https://github.com/votre-org/cyberincub/workflows/CI%20Frontend/badge.svg)
![Security](https://github.com/votre-org/cyberincub/workflows/Security%20Scan/badge.svg)
```

### Déploiement automatique

Vercel se connecte à votre repository GitHub et déploie automatiquement :

- **Production** : Push sur `main` → https://votre-app.vercel.app
- **Preview** : Chaque PR → URL unique pour test

---

## 🚀 Déploiement

### Déploiement sur Vercel (Recommandé)

#### 1. Prérequis

- Compte [Vercel](https://vercel.com)
- Repository GitHub connecté

#### 2. Import du projet

1. Vercel Dashboard > **Add New** > **Project**
2. Sélectionner votre repository GitHub
3. Détecter automatiquement : **Vite**
4. Configurer :
   - **Framework Preset** : Vite
   - **Root Directory** : `mini-blog`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

#### 3. Variables d'environnement

Dans Vercel Dashboard > **Settings** > **Environment Variables** :

```env
VITE_API_URL=https://votre-api.onrender.com/
```

#### 4. Déployer

Cliquez sur **Deploy**. Vercel déploie automatiquement !

**URL de production** : `https://votre-projet.vercel.app`

#### 5. Domaine personnalisé (optionnel)

Settings > Domains > Add Domain

### Déploiement sur Netlify

#### 1. Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
```

#### 2. Configuration

Créer `netlify.toml` :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://votre-api.onrender.com/"
```

#### 3. Déployer

```bash
netlify deploy --prod
```

### Déploiement sur GitHub Pages

#### 1. Configurer Vite

Dans `vite.config.ts` :

```typescript
export default defineConfig({
  base: '/nom-du-repo/',
  // ...
})
```

#### 2. Script de déploiement

Créer `deploy.sh` :

```bash
#!/usr/bin/env sh
set -e
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git main:gh-pages
cd -
```

#### 3. Déployer

```bash
sh deploy.sh
```

### Autres options

#### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 Tests

### Lancer les tests (à configurer)

```bash
# Tests unitaires avec Vitest
npm run test

# Tests E2E avec Playwright
npm run test:e2e

# Coverage
npm run test:coverage
```

### Configuration Vitest (à ajouter)

```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

---

## 🐛 Dépannage

### Problème : "Cannot connect to API"

**Solution** :
1. Vérifiez que le backend est lancé : `http://localhost:4000`
2. Vérifiez `VITE_API_URL` dans `.env`
3. Vérifiez les CORS sur le backend

### Problème : "Module not found"

**Solution** :
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : Build échoue avec erreur TypeScript

**Solution** :
```bash
# Vérifier les types
npm run type-check

# Corriger les erreurs de types
```

### Problème : Styles Tailwind ne s'appliquent pas

**Solution** :
1. Vérifiez `tailwind.config.js`
2. Vérifiez `postcss.config.js`
3. Redémarrez le serveur de dev

### Problème : Images ne s'affichent pas

**Solution** :
1. Vérifiez l'URL de l'image dans DevTools
2. Vérifiez que le backend sert les fichiers statiques
3. Vérifiez les CORS pour les images

---

## 🎨 Personnalisation

### Thème Tailwind

Modifiez `tailwind.config.js` :

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Votre couleur principale
          50: '#EFF6FF',
          // ...
        }
      }
    }
  }
}
```

### Composants Shadcn UI

Ajouter un nouveau composant :

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
```

### Polices personnalisées

Dans `index.css` :

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

---

## 📚 Ressources

### Documentation officielle

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)

### Tutoriels

- [React Tutorial](https://react.dev/learn)
- [TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Crash Course](https://www.youtube.com/watch?v=UBOj6rqRUME)

### Outils de développement

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)

---

## 👥 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Guidelines

- Suivre les conventions de code (ESLint + Prettier)
- Écrire des commits clairs (Conventional Commits)
- Tester localement avant de push
- Documenter les nouvelles fonctionnalités

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteurs

- **CyberIncub Team** - *Développement initial*

---

## 🙏 Remerciements

- React team pour le framework
- Vite pour la rapidité de build
- Tailwind CSS pour les utilitaires
- Shadcn UI pour les composants
- La communauté open-source

---

**Dernière mise à jour** : Janvier 2026  
**Version** : 1.0.0  
**Node.js** : >= 18.x  
**Status** : ✅ Production Ready
