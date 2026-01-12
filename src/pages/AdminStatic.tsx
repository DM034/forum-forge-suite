import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

type StaticUser = {
  id: string;
  roleId: string;
  name: string;
  email: string;
};

type StaticPost = {
  id: string;
  title: string;
  published: boolean;
};

const STATIC_USERS: StaticUser[] = [
  { id: "0b509d5a-c770-40ff-a119-ee10e78ba7b9", roleId: "8a98ec38-8f69-4868-badb-17c2989414a5", name: "Rabekoto Njara", email: "rabekoto.njara@example.com" },
  { id: "4e657183-2b1a-4916-8fbb-997c08aa4ca9", roleId: "8c42535f-e6b6-461f-90a9-4a5dc7731dab", name: "Andriantsoa Tsanta", email: "andriantsoa.tsanta@example.com" },
  { id: "7db72335-3870-4a82-ad65-0653492d854c", roleId: "97ac64e5-f32a-42eb-82b6-be755a7b6d1f", name: "Rakotomalala Tiana", email: "rakotomalala.tiana@example.com" },
  { id: "PROFILE-ADMIN-00001", roleId: "USER-ADMIN-00001", name: "Andria Tiana", email: "andria.tiana@example.com" },
  { id: "b1bfe571-9184-496d-a417-eecef432fa84", roleId: "87016dad-e762-40ff-b629-fc9cd6b45ed9", name: "Soa Fitiavana", email: "soa.fitiavana@example.com" },
];

const STATIC_POSTS: StaticPost[] = [
  { id: "post-1", title: "bonjour a tous", published: true },
  { id: "post-2", title: "Bonjour", published: true },
  { id: "post-3", title: "Post", published: true },
];

function AdminStaticContent() {
  const [users] = useState<StaticUser[]>(STATIC_USERS);
  const [posts, setPosts] = useState<StaticPost[]>(STATIC_POSTS);

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [userQuery, setUserQuery] = useState("");
  const [postQuery, setPostQuery] = useState("");

  // filter users by name (static data)
  const filteredUsers = users.filter((u) => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return true;
    return u.name.toLowerCase().includes(q);
  });

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // clamp page when filtered results change
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageUsers = filteredUsers.slice(start, end);

  const togglePublish = (id: string) => {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, published: !x.published } : x)));
    const post = posts.find((s) => s.id === id);
    if (post) toast.success(post.published ? "Publication masquée" : "Publication publiée");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Backoffice - Admin</h1>
          <p className="text-sm text-muted-foreground">Gérez les utilisateurs et les publications</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent border-b border-border/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <input
              placeholder="Rechercher par nom..."
              value={userQuery}
              onChange={(e) => { setUserQuery(e.target.value); setPage(1); }}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background/50 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all duration-200 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Nom</TableHead>
                  <TableHead className="font-semibold">Rôle</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageUsers.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {u.roleId.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast.success(`Bloquer ${u.name} (mock)`)}>
                          Bloquer
                        </Button>
                        <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => toast.success(`Supprimer ${u.name} (mock)`)}>
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Par page:</label>
              <select 
                value={limit} 
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
                className="px-3 py-1.5 rounded-md border border-input bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <PaginationItem key={pg}>
                    <PaginationLink 
                      href="#" 
                      isActive={pg === page} 
                      onClick={(e) => { e.preventDefault(); setPage(pg); }}
                      className={pg === page ? "bg-primary text-primary-foreground" : ""}
                    >
                      {pg}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent border-b border-border/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Publications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <input
              placeholder="Rechercher publications..."
              value={postQuery}
              onChange={(e) => setPostQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background/50 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all duration-200 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-3">
            {posts
              .filter((p) => {
                const q = postQuery.trim().toLowerCase();
                if (!q) return true;
                return p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
              })
              .map((p) => (
                <div 
                  key={p.id} 
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 
                    bg-gradient-to-r from-background to-muted/20 
                    hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded inline-block">
                      {p.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.published ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        Publié
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="border-0">
                        Brouillon
                      </Badge>
                    )}
                    <Button 
                      onClick={() => togglePublish(p.id)}
                      variant={p.published ? "outline" : "default"}
                      size="sm"
                      className="min-w-[80px]"
                    >
                      {p.published ? "Masquer" : "Publier"}
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Par page:</label>
              <select 
                value={limit} 
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
                className="px-3 py-1.5 rounded-md border border-input bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={3}>3</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <PaginationItem key={pg}>
                    <PaginationLink 
                      href="#" 
                      isActive={pg === page} 
                      onClick={(e) => { e.preventDefault(); setPage(pg); }}
                      className={pg === page ? "bg-primary text-primary-foreground" : ""}
                    >
                      {pg}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminStatic() {
  return (
    <Layout>
      <AdminStaticContent />
    </Layout>
  );
}

export { AdminStaticContent };
