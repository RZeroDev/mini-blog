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
import { ImageUpload } from "@/components/image-upload";
import { IconPlus, IconPhoto, IconTags, IconFileText, IconFolder } from "@tabler/icons-react";
import { CategoriesGrid } from "@/components/categories-grid";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/api/categories";
import { toast } from "sonner";

// Schéma de validation
const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .required("Le nom est requis"),
  image: Yup.mixed().required("L'image est requise"),
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  // Charger les catégories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      console.log("Catégories reçues:", data);
      
      // S'assurer que c'est un tableau
      if (Array.isArray(data)) {
        setCategories(data);
        // Calculer le nombre total de posts
        const total = data.reduce((acc: number, cat: Category) => acc + (cat._count?.posts || 0), 0);
        setTotalPosts(total);
      } else {
        console.error("Les données ne sont pas un tableau:", data);
        setCategories([]);
        setTotalPosts(0);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast.error("Erreur", {
        description:
          error instanceof Error ? error.message : "Erreur de chargement",
      });
      setCategories([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Formik pour créer une catégorie
  const createForm = useFormik({
    initialValues: {
      name: "",
      image: null as File | null,
    },
    validationSchema: categorySchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!values.image) return;
        
        await createCategory({
          name: values.name,
          image: values.image,
        });

        toast.success("Succès", {
          description: "Catégorie créée avec succès",
        });

        setCreateSheetOpen(false);
        resetForm();
        loadCategories();
      } catch (error) {
        toast.error("Erreur", {
          description:
            error instanceof Error ? error.message : "Erreur de création",
        });
      }
    },
  });

  // Formik pour modifier une catégorie
  const editForm = useFormik({
    initialValues: {
      name: "",
      image: null as File | null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .required("Le nom est requis"),
    }),
    onSubmit: async (values) => {
      try {
        if (!selectedCategory) return;

        await updateCategory(selectedCategory.id, {
          name: values.name,
          ...(values.image && { image: values.image }),
        });

        toast.success("Succès", {
          description: "Catégorie modifiée avec succès",
        });

        setEditSheetOpen(false);
        setSelectedCategory(null);
        loadCategories();
      } catch (error) {
        toast.error("Erreur", {
          description:
            error instanceof Error ? error.message : "Erreur de modification",
        });
      }
    },
  });

  // Ouvrir le sheet de modification
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    editForm.setValues({
      name: category.name,
      image: null,
    });
    setEditSheetOpen(true);
  };

  // Gérer la demande de suppression
  const handleDeleteRequest = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // Supprimer une catégorie
  const handleDelete = async () => {
    try {
      if (!selectedCategory) return;

      setDeletingId(selectedCategory.id);
      setDeleteDialogOpen(false);

      await deleteCategory(selectedCategory.id);

      toast.success("Succès", {
        description: "Catégorie supprimée avec succès",
      });

      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      toast.error("Erreur", {
        description:
          error instanceof Error ? error.message : "Erreur de suppression",
      });
    } finally {
      setDeletingId(null);
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
                <BreadcrumbPage>Catégories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
              <p className="text-muted-foreground">
                Gérez les catégories de votre blog
              </p>
            </div>

            <Button size="lg" className="gap-2" onClick={() => setCreateSheetOpen(true)}>
              <IconPlus className="h-5 w-5" />
              Nouvelle catégorie
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de catégories
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <IconTags className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Catégories actives
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Articles associés
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <IconFileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPosts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Articles au total
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Moyenne par catégorie
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <IconFolder className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {categories.length > 0 ? Math.round(totalPosts / categories.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Articles par catégorie
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des catégories</CardTitle>
              <CardDescription>
                {categories.length} catégorie{categories.length > 1 ? "s" : ""}{" "}
                disponible{categories.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-48 bg-muted animate-pulse" />
                      <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        <div className="flex gap-2 pt-2">
                          <div className="h-9 bg-muted rounded animate-pulse flex-1" />
                          <div className="h-9 bg-muted rounded animate-pulse flex-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : !Array.isArray(categories) || categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <IconPhoto className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">Aucune catégorie</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Commencez par créer votre première catégorie
                  </p>
                  <Button onClick={() => setCreateSheetOpen(true)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Créer une catégorie
                  </Button>
                </div>
              ) : (
                <CategoriesGrid
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                  deletingId={deletingId}
                />
              )}
            </CardContent>
          </Card>

          {/* Sheet de création */}
          <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
            <SheetContent side="right" className="w-full overflow-y-auto px-4">
              <SheetHeader>
                <SheetTitle>Créer une catégorie</SheetTitle>
                <SheetDescription>
                  Ajoutez une nouvelle catégorie pour organiser vos articles
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={createForm.handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Nom de la catégorie *</Label>
                  <Input
                    id="create-name"
                    name="name"
                    placeholder="Ex: Technologies"
                    value={createForm.values.name}
                    onChange={createForm.handleChange}
                    onBlur={createForm.handleBlur}
                  />
                  {createForm.touched.name && createForm.errors.name && (
                    <p className="text-sm text-red-500">
                      {createForm.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Image *</Label>
                  <ImageUpload
                    onChange={(file) => createForm.setFieldValue("image", file)}
                    placeholder="Ajouter une image"
                  />
                  {createForm.touched.image && createForm.errors.image && (
                    <p className="text-sm text-red-500">
                      {String(createForm.errors.image)}
                    </p>
                  )}
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
            <SheetContent side="right" className="w-full overflow-y-auto px-4">
              <SheetHeader>
                <SheetTitle>Modifier la catégorie</SheetTitle>
                <SheetDescription>
                  Modifiez les informations de la catégorie
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={editForm.handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom de la catégorie</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editForm.values.name}
                    onChange={editForm.handleChange}
                    onBlur={editForm.handleBlur}
                  />
                  {editForm.touched.name && editForm.errors.name && (
                    <p className="text-sm text-red-500">
                      {editForm.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Image (optionnel)</Label>
                  <ImageUpload
                    value={selectedCategory?.image ? `http://localhost:4000/${selectedCategory.image}` : undefined}
                    onChange={(file) => editForm.setFieldValue("image", file)}
                    placeholder="Changer l'image"
                  />
                </div>

                <SheetFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditSheetOpen(false);
                      setSelectedCategory(null);
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

          {/* Delete AlertDialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. La catégorie "
                  {selectedCategory?.name}" sera définitivement supprimée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setSelectedCategory(null)}
                >
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
