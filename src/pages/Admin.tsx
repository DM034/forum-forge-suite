import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import adminService from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLE_OPTIONS = [
  { id: "ROLE001", name: "ADMIN" },
  { id: "ROLE002", name: "MODERATOR" },
  { id: "ROLE003", name: "MEMBER" },
];

export default function Admin() {
  const [tab, setTab] = useState<"stats" | "users" | "moderation">("stats");

  const [stats, setStats] = useState<any>(null);

  const [qUsers, setQUsers] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const [qPosts, setQPosts] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  const [qComments, setQComments] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  const loadStats = async () => {
    const res = await adminService.getStats();
    setStats(res.data.data);
  };

  const loadUsers = async () => {
    const res = await adminService.listUsers({ q: qUsers });
    setUsers(res.data.data || []);
  };

  const loadPosts = async () => {
    const res = await adminService.listPosts({ q: qPosts, includeDeleted: true });
    setPosts(res.data.data || []);
  };

  const loadComments = async () => {
    const res = await adminService.listComments({ q: qComments, includeDeleted: true });
    setComments(res.data.data || []);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "moderation") {
      loadPosts();
      loadComments();
    }
    if (tab === "stats") loadStats();
  }, [tab]);

  const roleNameById = useMemo(() => {
    const m = new Map(ROLE_OPTIONS.map((r) => [r.id, r.name]));
    return (id: string) => m.get(id) ?? id;
  }, []);

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Button variant={tab === "stats" ? "default" : "outline"} onClick={() => setTab("stats")}>
            Stats
          </Button>
          <Button variant={tab === "users" ? "default" : "outline"} onClick={() => setTab("users")}>
            Utilisateurs
          </Button>
          <Button
            variant={tab === "moderation" ? "default" : "outline"}
            onClick={() => setTab("moderation")}
          >
            Modération
          </Button>
        </div>

        {tab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl border p-4">
              <div className="text-sm text-muted-foreground">Utilisateurs</div>
              <div className="text-2xl font-bold">{stats?.users ?? "-"}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-muted-foreground">Posts</div>
              <div className="text-2xl font-bold">{stats?.posts ?? "-"}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-muted-foreground">Messages</div>
              <div className="text-2xl font-bold">{stats?.messages ?? "-"}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-muted-foreground">Commentaires</div>
              <div className="text-2xl font-bold">{stats?.comments ?? "-"}</div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input value={qUsers} onChange={(e) => setQUsers(e.target.value)} placeholder="Search email / nom" />
              <Button onClick={loadUsers}>Recharger</Button>
            </div>

            <div className="rounded-xl border overflow-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-3">Email</th>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Rôle</th>
                    <th className="p-3">Bloqué</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.profile?.fullName ?? ""}</td>
                      <td className="p-3">{u.role?.name ?? roleNameById(u.roleId)}</td>
                      <td className="p-3">{u.blockedAt ? "Oui" : "Non"}</td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        <select
                          className="border rounded-md px-2 py-1 bg-background"
                          defaultValue={u.roleId}
                          onChange={async (e) => {
                            await adminService.setUserRole(u.id, e.target.value);
                            await loadUsers();
                          }}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>

                        <Button
                          variant="outline"
                          onClick={async () => {
                            await adminService.setUserBlocked(u.id, !Boolean(u.blockedAt));
                            await loadUsers();
                          }}
                        >
                          {u.blockedAt ? "Débloquer" : "Bloquer"}
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={async () => {
                            await adminService.deleteUser(u.id);
                            await loadUsers();
                          }}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td className="p-3 text-muted-foreground" colSpan={5}>
                        Aucun utilisateur
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "moderation" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={qPosts} onChange={(e) => setQPosts(e.target.value)} placeholder="Search posts" />
                <Button onClick={loadPosts}>Recharger</Button>
              </div>

              <div className="rounded-xl border overflow-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-3">Titre</th>
                      <th className="p-3">Auteur</th>
                      <th className="p-3">Masqué</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="p-3">{p.title}</td>
                        <td className="p-3">{p.user?.profile?.fullName ?? p.user?.email ?? ""}</td>
                        <td className="p-3">{p.deleted ? "Oui" : "Non"}</td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              await adminService.setPostVisibility(p.id, !Boolean(p.deleted));
                              await loadPosts();
                            }}
                          >
                            {p.deleted ? "Afficher" : "Masquer"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td className="p-3 text-muted-foreground" colSpan={4}>
                          Aucun post
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={qComments} onChange={(e) => setQComments(e.target.value)} placeholder="Search comments" />
                <Button onClick={loadComments}>Recharger</Button>
              </div>

              <div className="rounded-xl border overflow-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-3">Commentaire</th>
                      <th className="p-3">Post</th>
                      <th className="p-3">Auteur</th>
                      <th className="p-3">Masqué</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((c) => (
                      <tr key={c.id} className="border-b">
                        <td className="p-3">{c.content}</td>
                        <td className="p-3">{c.post?.title ?? ""}</td>
                        <td className="p-3">{c.user?.profile?.fullName ?? c.user?.email ?? ""}</td>
                        <td className="p-3">{c.deleted ? "Oui" : "Non"}</td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              await adminService.setCommentVisibility(c.id, !Boolean(c.deleted));
                              await loadComments();
                            }}
                          >
                            {c.deleted ? "Afficher" : "Masquer"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {comments.length === 0 && (
                      <tr>
                        <td className="p-3 text-muted-foreground" colSpan={5}>
                          Aucun commentaire
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
