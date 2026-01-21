export function BlogLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
      </div>
    </div>
  );
}

export function BlogLoaderFullPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-full border-4 border-muted"></div>
        <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
      </div>
      <p className="text-muted-foreground animate-pulse">Chargement...</p>
    </div>
  );
}

export function BlogLoaderInline() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="h-8 w-8 rounded-full border-2 border-muted"></div>
        <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin"></div>
      </div>
    </div>
  );
}
