import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
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
import { ArrowLeft, Eye, EyeOff, MessageSquare } from "lucide-react";

type StaticComment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  visible: boolean;
};

const STATIC_COMMENTS: StaticComment[] = [
  { id: "comment-1", postId: "post-1", author: "Rabekoto Njara", content: "Super article, merci pour le partage !", createdAt: "2025-01-11", visible: true },
  { id: "comment-2", postId: "post-1", author: "Andriantsoa Tsanta", content: "Je suis d'accord avec ce point de vue", createdAt: "2025-01-06", visible: true },
  { id: "comment-3", postId: "post-1", author: "Rakotomalala Tiana", content: "Très intéressant, j'aimerais en savoir plus", createdAt: "2025-01-07", visible: false },
  { id: "comment-4", postId: "post-2", author: "Soa Fitiavana", content: "Hello !", createdAt: "2025-01-08", visible: true },
  { id: "comment-5", postId: "post-2", author: "Andria Tiana", content: "Bonjour", createdAt: "2025-01-11", visible: true },
  { id: "comment-6", postId: "post-3", author: "Rabekoto Njara", content: "LOL", createdAt: "2025-01-10", visible: true },
];

const STATIC_POSTS: Record<string, string> = {
  "post-1": "bonjour a tous",
  "post-2": "Bonjour",
  "post-3": "Post",
};

export default function AdminComments() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const [comments, setComments] = useState<StaticComment[]>(STATIC_COMMENTS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const postTitle = postId ? STATIC_POSTS[postId] : "Toutes les publications";

  const filteredComments = comments.filter((c) => {
    const matchesPost = postId ? c.postId === postId : true;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      c.content.toLowerCase().includes(q) || 
      c.author.toLowerCase().includes(q);
    return matchesPost && matchesSearch;
  });

  const total = filteredComments.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageComments = filteredComments.slice(start, end);

  const toggleVisibility = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
    const comment = comments.find((c) => c.id === id);
    if (comment) {
      toast.success(comment.visible ? "Commentaire masqué" : "Commentaire visible");
    }
  };

  const deleteComment = (id: string) => {
    const comment = comments.find((c) => c.id === id);
    setComments((prev) => prev.filter((c) => c.id !== id));
    if (comment) {
      toast.success(`Commentaire de ${comment.author} supprimé`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/static")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Commentaires
            </h1>
            <p className="text-sm text-muted-foreground">
              Publication: <span className="font-medium text-foreground">{postTitle}</span>
            </p>
          </div>
        </div>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Liste des commentaires ({total})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <input
                placeholder="Rechercher par contenu ou auteur..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background/50 
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-all duration-200 placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Auteur</TableHead>
                    <TableHead className="font-semibold">Contenu</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageComments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun commentaire trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageComments.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium">{c.author}</TableCell>
                        <TableCell className="max-w-xs truncate">{c.content}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{c.createdAt}</TableCell>
                        <TableCell>
                          {c.visible ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                              Visible
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                              Masqué
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs gap-1"
                              onClick={() => toggleVisibility(c.id)}
                            >
                              {c.visible ? (
                                <>
                                  <EyeOff className="h-3 w-3" />
                                  Masquer
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" />
                                  Afficher
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 text-xs"
                              onClick={() => deleteComment(c.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                    />
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
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
