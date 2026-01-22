import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUpload } from "@/components/image-upload";
import { IconPlus, IconEdit, IconTrash, IconPhoto, IconFileText, IconEye } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getPostsPaginated,
  createPost,
  updatePost,
  deletePost,
} from "@/api/posts";
import { getCategories } from "@/api/categories";
import type { Post, PaginationMeta, UpdatePostDto } from "@/api/posts";
import type { Category } from "@/api/categories";
import { apiUrl } from "@/api";
import { sanitizeApiImageUrl } from "@/utils/sanitize";
import { toast } from "sonner";

// Schéma de validation pour création
const postCreateSchema = Yup.object({
  title: Yup.string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .required("Le titre est requis"),
  content: Yup.string()
    .min(10, "Le contenu doit contenir au moins 10 caractères")
    .required("Le contenu est requis"),
  categoryId: Yup.string().required("La catégorie est requise"),
  published: Yup.boolean(),
  image: Yup.mixed(),
});

// Schéma de validation pour édition
const postEditSchema = Yup.object({
  title: Yup.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  content: Yup.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  categoryId: Yup.string(),
  published: Yup.boolean(),
  image: Yup.mixed(),
});

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Charger les posts et catégories
  const loadData = async (page: number = 1) => {
    try {
      setLoading(true);
      const [postsResponse, categoriesData] = await Promise.all([
        getPostsPaginated(page, 10),
        getCategories(),
      ]);

      console.log("Posts response:", postsResponse);
      if (postsResponse && postsResponse.items) {
        setPosts(postsResponse.items);
        setPaginationMeta(postsResponse.meta);
      } else {
        console.warn("Format de réponse inattendu:", postsResponse);
        setPosts([]);
      }

      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast.error("Erreur", {
        description:
          error instanceof Error ? error.message : "Erreur de chargement",
      });
      setPosts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  // Calculer les statistiques
  const publishedCount = posts.filter(post => post.published).length;
  const draftCount = posts.filter(post => !post.published).length;

  // Formulaire de création
  const createForm = useFormik({
    initialValues: {
      title: "",
      content: "",
      categoryId: "",
      published: false,
      image: null as File | null,
    },
    validationSchema: postCreateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = {
          title: values.title,
          content: values.content,
          categoryId: values.categoryId,
          published: values.published,
          image: values.image as File | undefined,
        };

        await createPost(formData);
        toast.success("Succès", {
          description: "Article créé avec succès",
        });
        setCreateSheetOpen(false);
        resetForm();
        loadData(currentPage);
      } catch (error) {
        toast.error("Erreur", {
          description:
            error instanceof Error ? error.message : "Erreur lors de la création",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formulaire d'édition
  const editForm = useFormik({
    initialValues: {
      title: "",
      content: "",
      categoryId: "",
      published: false,
      image: null as File | null,
    },
    validationSchema: postEditSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedPost) return;

      try {
        const updateData: UpdatePostDto = {};
        if (values.title) updateData.title = values.title;
        if (values.content) updateData.content = values.content;
        if (values.categoryId) updateData.categoryId = values.categoryId;
        if (values.published !== undefined) updateData.published = values.published;
        if (values.image) updateData.image = values.image;

        await updatePost(selectedPost.id, updateData);
        toast.success("Succès", {
          description: "Article modifié avec succès",
        });
        setEditSheetOpen(false);
        setSelectedPost(null);
        loadData(currentPage);
      } catch (error) {
        toast.error("Erreur", {
          description:
            error instanceof Error ? error.message : "Erreur lors de la modification",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Ouvrir le sheet d'édition
  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    editForm.setValues({
      title: post.title,
      content: post.content,
      categoryId: post.categoryId,
      published: post.published,
      image: null,
    });
    setEditSheetOpen(true);
  };

  // Supprimer un post
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deletePost(deletingId);
      toast.success("Succès", {
        description: "Article supprimé avec succès",
      });
      setDeleteDialogOpen(false);
      setDeletingId(null);
      // Si c'est le dernier post de la page et qu'on n'est pas sur la première page, revenir à la page précédente
      if (posts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadData(currentPage);
      }
    } catch (error) {
      toast.error("Erreur", {
        description:
          error instanceof Error ? error.message : "Erreur lors de la suppression",
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Articles</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
              <p className="text-muted-foreground">
                Gérez tous vos articles de blog
              </p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => setCreateSheetOpen(true)}>
              <IconPlus className="h-5 w-5" />
              Nouvel article
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total d'articles
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <IconFileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{paginationMeta.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Articles au total
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Publiés
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <IconEye className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{publishedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Articles visibles
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Brouillons
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <IconEdit className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{draftCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Non publiés
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Articles List */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des articles</CardTitle>
              <CardDescription>
                {paginationMeta.total} article{paginationMeta.total > 1 ? "s" : ""} au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <IconPhoto className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Aucun article. Créez-en un pour commencer.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <Card 
                        key={post.id} 
                        className="overflow-hidden hover:shadow-lg transition-all group"
                      >
                        {/* Image */}
                        <div className="relative h-48 bg-muted overflow-hidden">
                          {post.image ? (
                            <img
                              src={sanitizeApiImageUrl(apiUrl, `uploads/posts/${post.image}`)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                              <IconPhoto className="h-16 w-16 text-muted-foreground/30" />
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm ${
                                post.published
                                  ? "bg-green-500/90 text-white"
                                  : "bg-gray-500/90 text-white"
                              }`}
                            >
                              {post.published ? "Publié" : "Brouillon"}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Category */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                {post.category.name}
                              </span>
                              {post.views && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <IconEye className="h-3 w-3" />
                                  {post.views}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
                              {post.title}
                            </h3>

                            {/* Content Preview */}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </p>

                            {/* Date */}
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEdit(post)}
                              >
                                <IconEdit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                onClick={() => {
                                  setDeletingId(post.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {paginationMeta.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(paginationMeta.totalPages, p + 1))
                            }
                            className={
                              currentPage === paginationMeta.totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sheet de création */}
        <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto px-4">
            <SheetHeader>
              <SheetTitle>Créer un article</SheetTitle>
              <SheetDescription>
                Ajoutez un nouvel article à votre blog
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={createForm.handleSubmit} className="space-y-6 mt-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="create-title">Titre *</Label>
                <Input
                  id="create-title"
                  name="title"
                  value={createForm.values.title}
                  onChange={createForm.handleChange}
                  onBlur={createForm.handleBlur}
                  placeholder="Mon super article"
                />
                {createForm.touched.title && createForm.errors.title && (
                  <p className="text-sm text-red-500">
                    {createForm.errors.title}
                  </p>
                )}
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="create-category">Catégorie *</Label>
                <Select
                  value={createForm.values.categoryId}
                  onValueChange={(value) =>
                    createForm.setFieldValue("categoryId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.touched.categoryId &&
                  createForm.errors.categoryId && (
                    <p className="text-sm text-red-500">
                      {createForm.errors.categoryId}
                    </p>
                  )}
              </div>

              {/* Contenu avec éditeur */}
              <div className="space-y-2">
                <Label>Contenu *</Label>
                <RichTextEditor
                  content={createForm.values.content}
                  onChange={(value) => createForm.setFieldValue("content", value)}
                  placeholder="Le contenu de votre article..."
                />
                {createForm.touched.content && createForm.errors.content && (
                  <p className="text-sm text-red-500">
                    {createForm.errors.content}
                  </p>
                )}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label>Image (optionnel)</Label>
                <ImageUpload
                  onChange={(file) => createForm.setFieldValue("image", file)}
                  placeholder="Ajouter une image"
                />
              </div>

              {/* Publié */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-published"
                  checked={createForm.values.published}
                  onChange={(e) =>
                    createForm.setFieldValue("published", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="create-published" className="cursor-pointer">
                  Publier l'article immédiatement
                </Label>
              </div>

              <SheetFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateSheetOpen(false);
                    createForm.resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={createForm.isSubmitting}>
                  {createForm.isSubmitting ? "Création..." : "Créer"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Sheet d'édition */}
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto px-4">
            <SheetHeader>
              <SheetTitle>Modifier l'article</SheetTitle>
              <SheetDescription>
                Modifiez les informations de l'article
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={editForm.handleSubmit} className="space-y-6 mt-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editForm.values.title}
                  onChange={editForm.handleChange}
                  onBlur={editForm.handleBlur}
                />
                {editForm.touched.title && editForm.errors.title && (
                  <p className="text-sm text-red-500">{editForm.errors.title}</p>
                )}
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="edit-category">Catégorie</Label>
                <Select
                  value={editForm.values.categoryId}
                  onValueChange={(value) =>
                    editForm.setFieldValue("categoryId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contenu avec éditeur */}
              <div className="space-y-2">
                <Label>Contenu</Label>
                <RichTextEditor
                  content={editForm.values.content}
                  onChange={(value) => editForm.setFieldValue("content", value)}
                />
                {editForm.touched.content && editForm.errors.content && (
                  <p className="text-sm text-red-500">{editForm.errors.content}</p>
                )}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label>Nouvelle image (optionnel)</Label>
                <ImageUpload
                  value={selectedPost?.image ? `${apiUrl}uploads/posts/${selectedPost.image}` : undefined}
                  onChange={(file) => editForm.setFieldValue("image", file)}
                  placeholder="Changer l'image"
                />
              </div>

              {/* Publié */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  checked={editForm.values.published}
                  onChange={(e) =>
                    editForm.setFieldValue("published", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-published" className="cursor-pointer">
                  Article publié
                </Label>
              </div>

              <SheetFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditSheetOpen(false);
                    setSelectedPost(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={editForm.isSubmitting}>
                  {editForm.isSubmitting ? "Modification..." : "Modifier"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Dialog de suppression */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'article sera définitivement
                supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingId(null)}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
