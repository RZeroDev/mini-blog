# Mise à Jour du CRUD Posts - Adapté au Backend

## ✅ Modifications effectuées

### 1. **Offcanvas au lieu de modales**
- ✅ Remplacé tous les `Dialog` par des `Sheet` (offcanvas)
- ✅ Ouverture depuis la droite avec scroll
- ✅ Grande surface pour faciliter l'édition

### 2. **Éditeur de texte riche intégré**
- ✅ Installation de **TipTap** (éditeur moderne compatible React 19)
- ✅ Création du composant `RichTextEditor` réutilisable
- ✅ Barre d'outils complète avec :
  - **Gras**, Italique, Barré
  - Titres (H1, H2, H3)
  - Listes à puces et numérotées
  - Bloc de code
  - Citations
  - Séparateur horizontal
- ✅ Placeholder personnalisable
- ✅ Styles CSS professionnels

### 3. **Champ extrait retiré**
- ✅ Supprimé de l'interface `Post`
- ✅ Supprimé des DTOs (`CreatePostDto`, `UpdatePostDto`)
- ✅ Supprimé de l'API (`posts.ts`)
- ✅ Supprimé des formulaires (création/édition)
- ✅ Supprimé de l'affichage (HomePage, CategoryPage, PostDetailPage)

### 4. **Option Publier/Brouillon**
- ✅ Checkbox "Publier l'article immédiatement" dans création
- ✅ Checkbox "Article publié" dans édition
- ✅ Badge visuel dans la liste (vert = Publié, gris = Brouillon)
- ✅ Envoi du statut `published` à l'API

## 📦 Nouveaux Packages Installés

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## 🎨 Composant RichTextEditor

**Fichier :** `/src/components/rich-text-editor.tsx`

**Props :**
```typescript
{
  content: string;           // Contenu HTML
  onChange: (content: string) => void;  // Callback de changement
  placeholder?: string;      // Texte placeholder optionnel
}
```

**Utilisation :**
```tsx
<RichTextEditor
  content={form.values.content}
  onChange={(value) => form.setFieldValue("content", value)}
  placeholder="Commencez à écrire..."
/>
```

## 🎯 Structure des Données (Backend)

### Post
```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;      // HTML formaté par l'éditeur
  image?: string;       // URL de l'image
  published: boolean;   // true = publié, false = brouillon
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

### CreatePostDto (envoyé à l'API)
```typescript
{
  title: string;          // Obligatoire
  content: string;        // HTML de l'éditeur, obligatoire
  categoryId: string;     // ID de la catégorie, obligatoire
  published?: boolean;    // Statut de publication, optionnel (défaut: false)
  image?: File;           // Fichier image, optionnel
}
```

### UpdatePostDto (envoyé à l'API)
```typescript
{
  title?: string;
  content?: string;       // HTML de l'éditeur
  categoryId?: string;
  published?: boolean;    // Changer le statut
  image?: File;           // Nouvelle image
}
```

## 🔧 Endpoints Backend Requis

```
POST   /posts              # Créer un post
  Body: FormData {
    title: string
    content: string (HTML)
    categoryId: string
    published: boolean
    image?: File
  }

PATCH  /posts/:id          # Modifier un post
  Body: FormData {
    title?: string
    content?: string (HTML)
    categoryId?: string
    published?: boolean
    image?: File
  }

GET    /posts              # Liste tous les posts
DELETE /posts/:id          # Supprimer un post
GET    /categories         # Liste des catégories (pour le select)
```

## 🎨 Interface Utilisateur

### Sheet de Création
- **Largeur** : Grande (max-w-2xl)
- **Position** : Droite (side="right")
- **Scroll** : Activé (overflow-y-auto)
- **Champs** :
  1. Titre (input texte)
  2. Catégorie (select dropdown)
  3. Contenu (éditeur riche TipTap)
  4. Image (upload fichier + prévisualisation)
  5. Publié (checkbox)

### Sheet d'Édition
- Même interface que création
- Pré-rempli avec les valeurs actuelles
- Possibilité de changer l'image

### Liste des Articles
- Image miniature
- Titre
- Catégorie + nombre de vues
- **Badge de statut** :
  - 🟢 Vert "Publié" si published = true
  - ⚪ Gris "Brouillon" si published = false
- Boutons Modifier/Supprimer

## 💡 Fonctionnalités de l'Éditeur

L'éditeur TipTap permet de :
- **Formater le texte** : Gras, Italique, Barré
- **Structurer** : Titres H1, H2, H3
- **Lister** : Puces, Numéros
- **Citer** : Blocs de citation
- **Coder** : Blocs de code
- **Séparer** : Lignes horizontales

Le contenu est sauvegardé en **HTML** et peut être affiché directement sur le front avec `dangerouslySetInnerHTML`.

## 📝 Différences avec la Version Précédente

| Avant | Après |
|-------|-------|
| Dialog (modale) | Sheet (offcanvas) |
| Textarea simple | Éditeur riche TipTap |
| Champ "extrait" | ❌ Supprimé |
| Pas de statut visible | Badge Publié/Brouillon |
| Texte brut | HTML formaté |

## 🚀 Comment Utiliser

### Créer un article
1. Cliquer sur "Nouvel article"
2. Le sheet s'ouvre depuis la droite
3. Remplir le titre et sélectionner une catégorie
4. Utiliser l'éditeur pour styliser le contenu
5. (Optionnel) Ajouter une image
6. Cocher "Publier immédiatement" si souhaité
7. Cliquer sur "Créer"

### Modifier un article
1. Cliquer sur l'icône crayon
2. Le sheet s'ouvre avec les données actuelles
3. Modifier ce qui est nécessaire
4. Changer le statut avec la checkbox
5. Cliquer sur "Modifier"

### Publier/Dépublier
- Dans l'édition, cocher/décocher "Article publié"
- Le badge dans la liste se met à jour automatiquement

## 🎯 Avantages

✅ **UX améliorée** : Offcanvas plus spacieux que les modales  
✅ **Contenu riche** : Éditeur WYSIWYG professionnel  
✅ **Simple** : Pas de champ superflu (extrait retiré)  
✅ **Visuel** : Badge clair pour le statut  
✅ **Moderne** : TipTap est léger et performant  
✅ **Compatible** : Fonctionne avec React 19  

## 🔍 Styles CSS

Les styles pour l'éditeur sont dans `/src/index.css` :
- Titres (H1, H2, H3)
- Listes (ul, ol)
- Citations (blockquote)
- Code (pre, code)
- Séparateurs (hr)

## ✅ Tout est Prêt !

Votre système de gestion d'articles est maintenant :
- ✅ Adapté au backend (sans extrait)
- ✅ Avec offcanvas au lieu de modales
- ✅ Avec éditeur de texte riche
- ✅ Avec gestion Publié/Brouillon

Accédez à : **http://localhost:5173/dashboard/posts** 🚀
