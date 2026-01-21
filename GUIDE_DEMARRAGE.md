# Guide de Démarrage Rapide - Mini Blog

## 🚀 Démarrage du Projet

### 1. Backend (API)

```bash
cd mini-blog-api
npm install
npm run start:dev
```

L'API sera disponible sur : `http://localhost:4000`

### 2. Frontend

```bash
cd mini-blog
npm install
npm run dev
```

Le frontend sera disponible sur : `http://localhost:5173`

## 📋 Configuration Requise

### Variables d'environnement (Backend)

Assurez-vous que votre fichier `.env` dans `mini-blog-api` contient :

```env
DATABASE_URL="votre_url_postgresql"
JWT_SECRET="votre_secret_jwt"
PORT=4000
```

### Configuration Frontend

Le fichier `/src/api/index.ts` pointe vers `http://localhost:4000` par défaut.

## 🎯 Endpoints API Requis

Pour que le frontend fonctionne correctement, assurez-vous que votre backend expose ces endpoints :

### Posts

```
GET    /posts                    # Liste tous les posts
GET    /posts?published=true     # Posts publiés uniquement
GET    /posts?limit=6            # Limite le nombre de résultats
GET    /posts/:id                # Post par ID
GET    /posts/slug/:slug         # Post par slug
POST   /posts                    # Créer un post
PATCH  /posts/:id                # Mettre à jour un post
DELETE /posts/:id                # Supprimer un post
```

### Catégories

```
GET    /categories               # Liste toutes les catégories
GET    /categories/:id           # Catégorie par ID
POST   /categories               # Créer une catégorie
PATCH  /categories/:id           # Mettre à jour une catégorie
DELETE /categories/:id           # Supprimer une catégorie
```

### Authentification

```
POST   /auth/login               # Connexion
POST   /auth/register            # Inscription
GET    /auth/profile             # Profil utilisateur
```

## 📊 Structure des Données

### Post

```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  published: boolean;
  views: number;
  authorId: string;
  categoryId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Category

```typescript
{
  id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Fonctionnalités Disponibles

### Pages Publiques

1. **Page d'accueil** (`/`)
   - Hero section avec CTA
   - Catégories populaires (8 max)
   - Articles récents (6 max)
   - Section newsletter
   - Footer complet

2. **Liste des catégories** (`/categories`)
   - Grille de toutes les catégories
   - Cards avec images

3. **Page catégorie** (`/category/:slug`)
   - Tous les articles d'une catégorie
   - Header avec image de catégorie

4. **Détail d'article** (`/post/:slug`)
   - Contenu complet de l'article
   - Informations auteur
   - Sidebar avec catégorie et partage

5. **À propos** (`/about`)
   - Mission et valeurs
   - CTA

6. **Contact** (`/contact`)
   - Formulaire de contact
   - Informations de contact
   - FAQ

### Pages Privées (Authentification requise)

7. **Dashboard** (`/dashboard`)
   - Statistiques
   - Aperçu du compte

8. **Gestion des catégories** (`/dashboard/categories`)
   - CRUD catégories

## 🎨 Design System

Le site utilise :
- **shadcn/ui** pour les composants
- **Tailwind CSS** pour le styling
- **Tabler Icons** pour les icônes

### Composants UI Disponibles

- Buttons (variants: default, outline, ghost, etc.)
- Cards
- Badges
- Dropdowns
- Forms (Input, Label, etc.)
- Skeletons
- Separators
- Et bien plus...

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large desktop */
```

## 🎯 Tests Recommandés

### 1. Tester le Header

- ✅ Navigation entre les pages
- ✅ Menu dropdown des catégories
- ✅ Menu mobile (réduire la fenêtre)
- ✅ Connexion/déconnexion

### 2. Tester la Page d'Accueil

- ✅ Chargement des catégories
- ✅ Chargement des articles récents
- ✅ Navigation vers les catégories
- ✅ Navigation vers les articles
- ✅ Skeletons de chargement

### 3. Tester la Navigation

- ✅ Cliquer sur une catégorie
- ✅ Cliquer sur un article
- ✅ Retour à l'accueil
- ✅ Menu footer

## 🐛 Debugging

### Erreurs Courantes

1. **API non accessible**
   - Vérifier que l'API tourne sur le port 4000
   - Vérifier les CORS dans le backend

2. **Catégories/Posts vides**
   - Utiliser le seed : `npm run seed` dans le backend
   - Créer des données manuellement via le dashboard

3. **Erreur d'authentification**
   - Vérifier le token dans localStorage
   - Vérifier le JWT_SECRET

## 📚 Commandes Utiles

### Backend

```bash
# Générer le client Prisma
npx prisma generate

# Créer/Migrer la base de données
npx prisma migrate dev

# Seed la base de données
npm run seed

# Ouvrir Prisma Studio
npx prisma studio
```

### Frontend

```bash
# Lancer en dev
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

## 🎉 Vous êtes prêt !

Votre blog moderne est maintenant opérationnel. Créez du contenu et profitez de l'expérience !

## 🆘 Besoin d'Aide ?

- Consultez le fichier `NOUVELLES_FONCTIONNALITES.md` pour plus de détails
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez les logs du backend
- Utilisez Prisma Studio pour inspecter la base de données

## 🚀 Prochaines Améliorations Possibles

1. 🔍 Fonction de recherche d'articles
2. 💬 Système de commentaires
3. ❤️ Système de likes fonctionnel
4. 🔖 Enregistrement d'articles favoris
5. 📧 Newsletter fonctionnelle avec envoi d'emails
6. 📊 Analytics et statistiques avancées
7. 🖼️ Galerie d'images
8. 🏷️ Système de tags
9. 📱 Application mobile (React Native)
10. 🌐 Multilingue (i18n)
