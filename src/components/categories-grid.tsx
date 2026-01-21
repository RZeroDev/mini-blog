import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IconEdit, IconTrash, IconSearch, IconLoader } from "@tabler/icons-react";
import type { Category } from "@/api/categories";
import { apiUrl } from "@/api";

interface CategoriesGridProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  deletingId?: string | null;
}

const ITEMS_PER_PAGE = 6;

export function CategoriesGrid({
  categories,
  onEdit,
  onDelete,
  deletingId,
}: CategoriesGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer la pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Réinitialiser la page lors d'une recherche
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche et stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredCategories.length} résultat{filteredCategories.length > 1 ? "s" : ""}
          </Badge>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearch("")}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Grid de cards */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchTerm
            ? `Aucune catégorie trouvée pour "${searchTerm}"`
            : "Aucune catégorie disponible"}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {currentCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={`${apiUrl}${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg truncate">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {category.slug}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onEdit(category)}
                      disabled={deletingId === category.id}
                    >
                      <IconEdit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(category)}
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? (
                        <>
                          <IconLoader className="h-4 w-4 mr-2 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        <>
                          <IconTrash className="h-4 w-4 mr-2" />
                          Supprimer
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        currentPage === totalPages
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
    </div>
  );
}
