import { useEffect, useState } from 'react';
import { getLogs, getLogsByAction, cleanupOldLogs } from '../api/logs';
import type { Log } from '../api/logs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  IconActivity,
  IconFilter,
  IconTrash,
  IconUser,
  IconFileText,
  IconTags,
  IconLogin,
  IconRefresh,
} from '@tabler/icons-react';
import { toast } from 'sonner';

const LogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const logsPerPage = 20;

  const fetchLogs = async (page: number = 1, action: string | null = null) => {
    try {
      setLoading(true);
      let response;
      
      if (action) {
        response = await getLogsByAction(action, page, logsPerPage);
      } else {
        response = await getLogs(page, logsPerPage);
      }

      setLogs(response.data.items);
      setTotalPages(response.data.meta.totalPages);
      setTotalLogs(response.data.meta.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
      toast.error('Erreur lors du chargement des logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1, selectedAction);
  }, [selectedAction]);

  const handleCleanup = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer les logs de plus de 90 jours ?')) {
      return;
    }

    try {
      setIsCleaningUp(true);
      await cleanupOldLogs(90);
      toast.success('Logs anciens supprimés avec succès');
      fetchLogs(1, selectedAction);
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      toast.error('Erreur lors du nettoyage des logs');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'DELETE':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'VIEW':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'LOGIN':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'POST':
        return <IconFileText className="h-4 w-4" />;
      case 'CATEGORY':
        return <IconTags className="h-4 w-4" />;
      case 'USER':
        return <IconUser className="h-4 w-4" />;
      case 'AUTH':
        return <IconLogin className="h-4 w-4" />;
      default:
        return <IconActivity className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const actionFilters = [
    { label: 'Tous', value: null },
    { label: 'Créations', value: 'CREATE' },
    { label: 'Modifications', value: 'UPDATE' },
    { label: 'Suppressions', value: 'DELETE' },
    { label: 'Vues', value: 'VIEW' },
    { label: 'Connexions', value: 'LOGIN' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Logs système</h1>
          <p className="text-muted-foreground mt-1">
            Historique des actions effectuées sur la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLogs(currentPage, selectedAction)}
            disabled={loading}
          >
            <IconRefresh className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCleanup}
            disabled={isCleaningUp}
          >
            <IconTrash className="h-4 w-4 mr-2" />
            Nettoyer
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de logs</CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enregistrements au total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page actuelle</CardTitle>
            <IconFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentPage} / {totalPages}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {logs.length} logs affichés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Filtre actif</CardTitle>
            <IconFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedAction || 'Aucun'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Type d'action filtré
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtrer par action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {actionFilters.map((filter) => (
              <Button
                key={filter.label}
                variant={selectedAction === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAction(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des logs */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des activités</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <IconActivity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun log trouvé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEntityIcon(log.entity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {log.entity}
                      </span>
                      {log.entityId && (
                        <span className="text-xs text-muted-foreground font-mono">
                          #{log.entityId.substring(0, 8)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                      {log.userName && (
                        <span className="flex items-center gap-1">
                          <IconUser className="h-3 w-3" />
                          {log.userName}
                        </span>
                      )}
                      <span>{formatDate(log.createdAt)}</span>
                      {log.ipAddress && (
                        <span className="font-mono">{log.ipAddress}</span>
                      )}
                    </div>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-primary cursor-pointer hover:underline">
                          Voir les détails
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                          {JSON.stringify(JSON.parse(log.details), null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs(currentPage - 1, selectedAction)}
                disabled={currentPage === 1 || loading}
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLogs(currentPage + 1, selectedAction)}
                disabled={currentPage === totalPages || loading}
              >
                Suivant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
