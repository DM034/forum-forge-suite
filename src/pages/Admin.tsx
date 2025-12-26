import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import adminService, { AdminRole, AdminUser, AdminPost, AdminComment } from "@/services/adminService";

export default function Admin() {
  const [stats, setStats] = useState<any>(null);

  const [roles, setRoles] = useState<AdminRole[]>([]);

  const [uq, setUq] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [pq, setPq] = useState("");
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const [cq, setCq] = useState("");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const roleOptions = useMemo(() => roles, [roles]);

  const loadStats = async () => {
    const res = await adminService.stats();
    setStats(res.data.data);
  };

  const loadRoles = async () => {
    const res = await adminService.roles();
    setRoles(res.data.data);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminService.users({ page: 1, limit: 50, q: uq, includeDeleted: true });
      setUsers(res.data.data.items);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await adminService.posts({ page: 1, limit: 50, q: pq, includeDeleted: true });
      setPosts(res.data.data.items);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await adminService.comments({ page: 1, limit: 50, q: cq, includeDeleted: true });
      setComments(res.data.data.items);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadStats(), loadRoles(), loadUsers(), loadPosts(), loadComments()]);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Erreur admin");
      }
    })();
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

  const onToggleBlock = async (u: AdminUser) => {
    const next = !u.blockedAt;
    try {
      await adminService.setUserBlocked(u.id, next);
      toast.success(next ? "Utilisateur bloqué" : "Utilisateur débloqué");
      await loadUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  const onDeleteUser = async (u: AdminUser) => {
    try {
      await adminService.deleteUser(u.id);
      toast.success("Utilisateur supprimé");
      await loadUsers();
      await loadStats();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  const onTogglePost = async (p: AdminPost) => {
    try {
      await adminService.setPostVisibility(p.id, !p.deleted);
      toast.success(!p.deleted ? "Post masqué" : "Post réaffiché");
      await loadPosts();
      await loadStats();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  const onToggleComment = async (c: AdminComment) => {
    try {
      await adminService.setCommentVisibility(c.id, !c.deleted);
      toast.success(!c.deleted ? "Commentaire masqué" : "Commentaire réaffiché");
      await loadComments();
      await loadStats();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur");
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Espace administrateur</h1>
          <Button variant="outline" onClick={() => Promise.all([loadStats(), loadUsers(), loadPosts(), loadComments()])}>
            Rafraîchir
          </Button>
        </div>

        <Tabs defaultValue="stats">
          <TabsList>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="moderation">Modération</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader><CardTitle>Utilisateurs</CardTitle></CardHeader>
                <CardContent className="text-3xl font-bold">{stats?.users ?? "-"}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Posts</CardTitle></CardHeader>
                <CardContent className="text-3xl font-bold">{stats?.posts ?? "-"}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Commentaires</CardTitle></CardHeader>
                <CardContent className="text-3xl font-bold">{stats?.comments ?? "-"}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Messages</CardTitle></CardHeader>
                <CardContent className="text-3xl font-bold">{stats?.messages ?? "-"}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
                                </SelectItem>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input placeholder="Recherche post..." value={pq} onChange={(e) => setPq(e.target.value)} />
                    <Button onClick={loadPosts} disabled={postsLoading}>Rechercher</Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.title}</TableCell>
                          <TableCell>
                            {p.deleted ? <Badge variant="destructive">Masqué</Badge> : <Badge variant="secondary">Visible</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" onClick={() => onTogglePost(p)}>
                              {p.deleted ? "Réafficher" : "Masquer"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {posts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            Aucun post
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input placeholder="Recherche commentaire..." value={cq} onChange={(e) => setCq(e.target.value)} />
                    <Button onClick={loadComments} disabled={commentsLoading}>Rechercher</Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contenu</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            <div className="line-clamp-2">{c.content}</div>
                            <div className="text-xs text-muted-foreground">
                              Post: {c.post?.title || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {c.deleted ? <Badge variant="destructive">Masqué</Badge> : <Badge variant="secondary">Visible</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" onClick={() => onToggleComment(c)}>
                              {c.deleted ? "Réafficher" : "Masquer"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {comments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            Aucun commentaire
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
