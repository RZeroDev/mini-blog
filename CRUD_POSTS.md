# CRUD des Articles - Documentation

## ✅ Ce qui a été créé

### Page de Gestion des Articles (`PostsPage.tsx`)

Une page complète de gestion des articles avec toutes les opérations CRUD :

**Fonctionnalités :**
- ✅ **Liste** des articles avec aperçu
- ✅ **Création** d'articles avec formulaire complet
- ✅ **Modification** d'articles existants
- ✅ **Suppression** avec confirmation
- ✅ **Upload d'images** pour les articles
- ✅ **Sélection de catégorie** depuis un dropdown
- ✅ **Statut de publication** (Publié/Brouillon)
- ✅ **Validation** des formulaires avec Yup

### Champs du Formulaire

#### Création d'article
1. **Titre** (obligatoire)
   - Minimum 3 caractères
   
2. **Catégorie** (obligatoire)
   - Sélection depuis la liste des catégories existantes
   
3. **Extrait** (optionnel)
   - Résumé court de l'article
   - Affiché sur les cartes de prévisualisation
   
4. **Contenu** (obligatoire)
   - Minimum 10 caractères
   - Zone de texte large pour le contenu principal
   
5. **Image** (optionnel)
   - Upload de fichier image
   - Prévisualisation immédiate
   
6. **Publié** (checkbox)
   - Définit si l'article est publié ou en brouillon

#### Modification d'article
- Tous les champs ci-dessus
- Pré-remplis avec les valeurs actuelles
- Possibilité de modifier l'image (nouvelle upload)

### Interface Utilisateur

**Liste des articles :**
- Affichage en liste avec :
  - Image miniature (si disponible)
  - Titre de l'article
  - Catégorie
  - Nombre de vues
  - Badge de statut (Publié/Brouillon)
  - Boutons d'actions (Modifier/Supprimer)

**Dialogs :**
- **Création** : Grande modale scrollable avec formulaire complet
- **Édition** : Même interface que création, pré-remplie
- **Suppression** : Dialog de confirmation pour éviter les erreurs

### Intégration

**Routes ajoutées :**
```typescript
// Dans App.tsx
<Route
  path="/dashboard/posts"
  element={
    <PrivateRoute>
      <PostsPage />
    </PrivateRoute>
  }
/>
```

**Navigation :**
- Accessible via la sidebar : "Articles"
- URL : `/dashboard/posts`
- Protégé par authentification

### API Utilisée

Utilise les fonctions de `/src/api/posts.ts` :

```typescript
// Lecture
getPosts(): Promise<Post[]>

// Création
createPost(data: CreatePostDto): Promise<Post>

// Modification
updatePost(id: string, data: UpdatePostDto): Promise<Post>

// Suppression
deletePost(id: string): Promise<void>
```

### Validation

**Schémas Yup :**

**Création :**
- `title`: min 3 caractères, requis
- `content`: min 10 caractères, requis
- `categoryId`: requis
- `excerpt`: optionnel
- `image`: optionnel
- `published`: boolean

**Édition :**
- Mêmes règles mais tous les champs optionnels
- Seuls les champs modifiés sont envoyés à l'API

### Notifications

Utilise `sonner` pour les toasts :
- ✅ Succès : "Article créé/modifié/supprimé avec succès"
- ❌ Erreur : Messages d'erreur détaillés

### États de Chargement

- Loading spinner pendant le chargement initial
- Boutons désactivés pendant les opérations
- Messages "Création..." / "Modification..." pendant l'envoi

## 🎯 Utilisation

### Créer un article

1. Cliquer sur "Nouvel article" en haut à droite
2. Remplir le formulaire :
   - Titre (obligatoire)
   - Catégorie (obligatoire)
   - Contenu (obligatoire)
   - Extrait (optionnel)
   - Image (optionnel)
3. Cocher "Publier immédiatement" si souhaité
4. Cliquer sur "Créer"

### Modifier un article

1. Cliquer sur l'icône "Crayon" sur l'article
2. Modifier les champs souhaités
3. Cliquer sur "Modifier"

### Supprimer un article

1. Cliquer sur l'icône "Poubelle" sur l'article
2. Confirmer la suppression dans le dialog
3. L'article est supprimé définitivement

## 🔧 Prérequis Backend

Assurez-vous que votre backend expose ces endpoints :

```
GET    /posts              # Liste tous les posts
POST   /posts              # Créer un post
PATCH  /posts/:id          # Modifier un post
DELETE /posts/:id          # Supprimer un post
GET    /categories         # Liste des catégories (pour le select)
```

### Format de données attendu

**CreatePostDto :**
```typescript
{
  title: string;
  content: string;
  excerpt?: string;
  image?: File;
  published?: boolean;
  categoryId: string;
}
```

**UpdatePostDto :**
```typescript
{
  title?: string;
  content?: string;
  excerpt?: string;
  image?: File;
  published?: boolean;
  categoryId?: string;
}
```

## 🎨 Design

Le design suit le même style que CategoriesPage :
- Interface sobre et professionnelle
- Composants shadcn/ui
- Responsive
- Feedback utilisateur clair

## ✨ Améliorations Possibles

1. **Éditeur WYSIWYG**
   - Remplacer le textarea par un éditeur riche (TinyMCE, Quill)
   
2. **Filtres et Recherche**
   - Filtrer par catégorie
   - Rechercher par titre
   - Trier par date/vues
   
3. **Pagination**
   - Paginer la liste des articles
   
4. **Prévisualisation**
   - Prévisualiser l'article avant publication
   
5. **Brouillons auto-sauvegardés**
   - Sauvegarder automatiquement les brouillons
   
6. **Tags**
   - Ajouter un système de tags en plus des catégories
   
7. **SEO**
   - Ajouter des champs meta (description, keywords)
   
8. **Statistiques**
   - Voir les statistiques par article (vues, likes)

## 🚀 C'est Prêt !

Votre système de gestion d'articles est maintenant opérationnel !

Accédez à : **http://localhost:5173/dashboard/posts** (après connexion)

---

**Navigation :**
- Dashboard → Articles → Gérer vos articles
