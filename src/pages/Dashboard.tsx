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
import { useAppSelector } from "@/store/hooks";
import {
  IconArticle,
  IconTags,
  IconEye,
  IconTrendingUp,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

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
                <BreadcrumbPage>Accueil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Welcome Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Bienvenue, {user?.firstName} 
                </h1>
                <p className="text-muted-foreground">
                  Voici un aperçu de votre blog
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <IconPlus className="h-5 w-5" />
                Nouvel article
              </Button>
            </div>
          </div>

          {/* Stats Grid with Icons */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Articles Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Articles
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <IconArticle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Articles publiés
                </p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <IconTrendingUp className="h-3 w-3 mr-1" />
                  <span>+0% ce mois-ci</span>
                </div>
              </CardContent>
            </Card>

            {/* Categories Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Catégories
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <IconTags className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Catégories actives
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>Prêt pour l'organisation</span>
                </div>
              </CardContent>
            </Card>

            {/* Views Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Vues
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <IconEye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vues totales
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span>Commence à publier pour voir les stats</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Vos dernières actions sur le blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <IconArticle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">Aucune activité</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Commencez par créer votre premier article pour voir votre activité ici
                </p>
                <Button className="mt-4 gap-2">
                  <IconPlus className="h-4 w-4" />
                  Créer mon premier article
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
