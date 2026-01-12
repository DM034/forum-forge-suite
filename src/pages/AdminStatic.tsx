import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const togglePublish = (id: string) => {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, published: !x.published } : x)));
    const post = posts.find((s) => s.id === id);
    if (post) toast.success(post.published ? "Publication masquée" : "Publication publiée");
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Backoffice statique - Admin</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs fournis (statique)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded hover:bg-accent/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={undefined} />
                    <AvatarFallback>{u.name.split(" ").map((s) => s[0]).slice(0,2).join("").toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-sm text-muted-foreground">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="mr-4 text-xs text-muted-foreground">roleId: {u.roleId}</div>
                  <Badge variant="outline">Admin (statique)</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publications (exemples)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.map((p) => (
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
