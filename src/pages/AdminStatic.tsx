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
  { id: "post-1", title: "Annonce: Réunion cette semaine", published: true },
  { id: "post-2", title: "Guide de publication mis à jour", published: false },
  { id: "post-3", title: "Nouvelles fonctionnalités du forum", published: true },
];

export default function AdminStatic() {
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
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Backoffice - Admin</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full">
                <input
                  placeholder="Rechercher par nom..."
                  value={userQuery}
                  onChange={(e) => { setUserQuery(e.target.value); setPage(1); }}
                  className="input w-full"
                />
              </div>
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
                {pageUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.roleId}</TableCell>
                    <TableCell>{"Actif"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.success(`Bloquer ${u.name} (mock)`)}>Bloquer</Button>
                        <Button size="sm" variant="destructive" onClick={() => toast.success(`Supprimer ${u.name} (mock)`)}>Supprimer</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">{total} utilisateurs</div>
              <div className="flex items-center gap-2">
                <div>
                  <label className="mr-2 text-sm">Par page:</label>
                  <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="input">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <PaginationItem key={pg}>
                        <PaginationLink href="#" isActive={pg === page} onClick={(e) => { e.preventDefault(); setPage(pg); }}>{pg}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="mb-4">
              <input
                placeholder="Rechercher publications..."
                value={postQuery}
                onChange={(e) => setPostQuery(e.target.value)}
                className="input w-full"
              />
            </div>

            {posts
              .filter((p) => {
                const q = postQuery.trim().toLowerCase();
                if (!q) return true;
                return p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
              })
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded hover:bg-accent/50">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground">ID: {p.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.published ? <Badge variant="secondary">Publié</Badge> : <Badge variant="destructive">Brouillon</Badge>}
                    <Button onClick={() => togglePublish(p.id)}>{p.published ? "Masquer" : "Publier"}</Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
