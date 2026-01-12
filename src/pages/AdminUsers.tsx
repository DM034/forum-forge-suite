import { useEffect, useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import adminService from "@/services/adminService";

export default function AdminUsers() {
  const [uq, setUq] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [roles, setRoles] = useState<any[]>([]);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [lastError, setLastError] = useState<any>(null);

  const roleOptions = useMemo(() => roles, [roles]);

  const loadRoles = async () => {
    try {
      const res = await adminService.roles();
      setRoles(res.data.data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur chargement rôles");
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminService.users({ page: 1, limit: 100, q: uq, includeDeleted: true });
      setLastResponse(res?.data ?? null);
      setLastError(null);
      setUsers(res.data.data.items || []);
    } catch (e: any) {
      setLastError(e?.response?.data ?? e?.message ?? e);
      setLastResponse(null);
      toast.error(e?.response?.data?.message || "Erreur chargement utilisateurs");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadRoles(), loadUsers()]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeRole = async (userId: string, roleId: string) => {
    try {
      await adminService.setUserRole(userId, roleId);
      toast.success("Rôle modifié");
      await loadUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  const onToggleBlock = async (u: any) => {
    const next = !u.blockedAt;
    try {
      await adminService.setUserBlocked(u.id, next);
      toast.success(next ? "Utilisateur bloqué" : "Utilisateur débloqué");
      await loadUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  const onDeleteUser = async (u: any) => {
    if (!window.confirm(`Supprimer l'utilisateur ${u.email} ?`)) return;
    try {
      await adminService.deleteUser(u.id);
      toast.success("Utilisateur supprimé");
      await loadUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Utilisateurs (Backoffice)</h1>
          <Button variant="outline" onClick={loadUsers} disabled={usersLoading}>
            Rafraîchir
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Recherche (email / nom)..." value={uq} onChange={(e) => setUq(e.target.value)} />
            <Button onClick={loadUsers} disabled={usersLoading}>Rechercher</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell>{u.profile?.fullName || "-"}</TableCell>
                  <TableCell>
                    <Select value={u.roleId} onValueChange={(v) => onChangeRole(u.id, v)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="space-x-2">
                    {u.deletedAt ? <Badge variant="destructive">Supprimé</Badge> : <Badge variant="secondary">Actif</Badge>}
                    {u.blockedAt ? <Badge variant="destructive">Bloqué</Badge> : <Badge variant="outline">OK</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" onClick={() => onToggleBlock(u)} disabled={!!u.deletedAt}>
                      {u.blockedAt ? "Débloquer" : "Bloquer"}
                    </Button>
                    <Button variant="destructive" onClick={() => onDeleteUser(u)} disabled={!!u.deletedAt}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Aucun utilisateur
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Debug panel: show raw response or error to help troubleshoot empty list */}
          <div className="mt-4">
            <details className="bg-muted p-3 rounded">
              <summary className="cursor-pointer">Debug (raw API response / last error)</summary>
              <pre className="whitespace-pre-wrap mt-2 text-sm">{lastResponse ? JSON.stringify(lastResponse, null, 2) : lastError ? JSON.stringify(lastError, null, 2) : 'No response yet'}</pre>
            </details>
          </div>
        </div>
      </div>
    </Layout>
  );
}
