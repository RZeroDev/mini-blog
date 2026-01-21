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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { IconPlus, IconEdit, IconTrash, IconPhoto } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/api/posts";
import { getCategories } from "@/api/categories";
import type { Post } from "@/api/posts";
import type { Category } from "@/api/categories";
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
  const [imagePreview, setImagePreview] = useState<string>("");

  // Charger les posts et catégories
  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        getPosts(),
        getCategories(),
      ]);

      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else {
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
    loadData();
  }, []);

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
        setImagePreview("");
        loadData();
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
        const updateData: any = {};
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
        setImagePreview("");
        loadData();
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

  // Gestion de l'image
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: typeof createForm | typeof editForm
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    setImagePreview(post.image || "");
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
      loadData();
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

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Articles</CardTitle>
                  <CardDescription>
                    Créez, modifiez et supprimez vos articles
                  </CardDescription>
                </div>
                <Button onClick={() => setCreateSheetOpen(true)}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Nouvel article
                </Button>
              </div>
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
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {post.category.name} • {post.views} vues
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                post.published
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {post.published ? "Publié" : "Brouillon"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(post)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingId(post.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sheet de création */}
        <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
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
                <Label htmlFor="create-image">Image (optionnel)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="create-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, createForm)}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                </div>
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
                    setImagePreview("");
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
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
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
                <Label htmlFor="edit-image">Nouvelle image (optionnel)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, editForm)}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                </div>
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
                    setImagePreview("");
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
