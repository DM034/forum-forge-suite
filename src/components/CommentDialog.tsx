import { useState, useMemo, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Send,
  CornerDownRight,
  Trash2,
  Heart,
  Paperclip,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import apiClient from "@/api/apiClient";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id?: string;
    author: string;
    time: string;
    content: string;
    emoji?: string;
    avatarUrl?: string;
    attachments?: string[];
    likes?: number;
    liked?: boolean;
    reactionId?: string | null;
  };
  onDeletePost?: () => void;
}

type ReplyItem = {
  id: string;
  author: string;
  time: string;
  content: string;
  files?: File[];
};

type CommentItem = {
  id: string;
  author: string;
  time: string;
  content: string;
  replies: ReplyItem[];
  likes: number;
  liked: boolean;
  reactionId?: string | null;
  files?: File[];
};

const initialsOf = (s?: string | null) => {
  if (!s) return "U";
  const base = String(s).trim();
  if (!base) return "U";
  const parts = base.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.substring(0, 2).toUpperCase();
};

const CommentDialog = ({
  open,
  onOpenChange,
  post,
  onDeletePost,
}: CommentDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const me =
    (user as any)?.fullName ||
    (user as any)?.username ||
    ((user as any)?.email ? String((user as any).email).split("@")[0] : "Vous");

  const isMyPost = useMemo(() => {
    const a = String(post.author).toLowerCase().trim();
    const m = String(me).toLowerCase().trim();
    return a === m || a === "vous";
  }, [post.author, me]);

  const [commentContent, setCommentContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyFiles, setReplyFiles] = useState<Record<string, File[]>>({});

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // ----- Réaction du post -----
  const [postLiked, setPostLiked] = useState<boolean>(!!post.liked);
  const [postLikes, setPostLikes] = useState<number>(post.likes ?? 0);
  const [postReactionId, setPostReactionId] = useState<string | null>(
    (post as any)?.reactionId ?? null
  );

  const maxDisplay = 4;
  const totalAtt = post.attachments?.length ?? 0;
  const displayAtt = (post.attachments || []).slice(0, maxDisplay);

  // Réinitialiser l’état du like post quand le post change
  useEffect(() => {
    setPostLiked(!!post.liked);
    setPostLikes(post.likes ?? 0);
    setPostReactionId((post as any)?.reactionId ?? null);
  }, [post.id, post.liked, post.likes]);

  // ----- Chargement des commentaires -----
  useEffect(() => {
    if (!open || !post.id) return;

    const load = async () => {
      setLoadingComments(true);
      try {
        const res = await apiClient.get(`/comments/${post.id}`);
        const raw = res.data?.data || [];
        console.log("Loaded comments:", raw);

        const formatted: CommentItem[] = raw
          .filter((c: any) => !c.parentCommentId)
          .map((c: any) => ({
            id: String(c.id),
            author: c.user?.profile?.fullName || c.user?.email || "Utilisateur",
            time: new Date(c.createdAt).toLocaleString(),
            content: c.content,
            likes: c._count?.reactions ?? 0,
            liked: Boolean(c.myReaction),
            reactionId: c.myReaction?.id ?? null,
            replies: raw
              .filter((r: any) => r.parentCommentId === c.id)
              .map((r: any) => ({
                id: String(r.id),
                author:
                  r.user?.profile?.fullName || r.user?.email || "Utilisateur",
                time: new Date(r.createdAt).toLocaleString(),
                content: r.content,
              })),
          }));

        setComments(formatted);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      setLoadingComments(false);
    };

    load();
  }, [open, post.id]);

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) return URL.createObjectURL(file);
    return null;
  };

  const openViewer = (images: string[], index: number) => {
    if (images.length === 0) return;
    setViewerImages(images);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ----- Création d’un commentaire -----
  const handleSubmit = async () => {
    if (!commentContent.trim() || !post.id) return;

    const content = commentContent.trim();

    const tempId = "temp-" + Date.now();
    const optimistic: CommentItem = {
      id: tempId,
      author: me,
      time: "À l’instant",
      content,
      replies: [],
      likes: 0,
      liked: false,
    };

    setComments((prev) => [optimistic, ...prev]);
    setCommentContent("");

    try {
      const res = await apiClient.post("/comments", {
        postId: post.id,
        content,
        parentCommentId: null,
      });

      const saved = res.data?.data;
      console.log("Saved comment:", saved);

      setComments((prev) =>
        prev.map((c) =>
          c.id === tempId
            ? {
                id: String(saved.id),
                author:
                  saved.user?.profile?.fullName ||
                  saved.user?.email ||
                  "Utilisateur",
                time: new Date(saved.createdAt).toLocaleString(),
                content: saved.content,
                replies: [],
                likes: saved._count?.reactions ?? 0,
                liked: Boolean(saved.myReaction),
                reactionId: saved.myReaction?.id ?? null,
              }
            : c
        )
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      // rollback simple : on enlève le temp
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  // ----- Réponses -----
  const openReply = (id: string) => {
    setReplyingTo(id);
    setReplyContent("");
    setReplyFiles((p) => ({ ...p, [id]: [] }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const onReplyFiles = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setReplyFiles((p) => ({ ...p, [id]: Array.from(e.target.files) }));
  };

  const removeReplyFile = (cid: string, index: number) => {
    setReplyFiles((p) => {
      const next = (p[cid] || []).filter((_, i) => i !== index);
      return { ...p, [cid]: next };
    });
  };

  const submitReply = async (id: string) => {
    if (!replyContent.trim() || !post.id) return;

    const content = replyContent.trim();
    const tempId = "temp-r-" + Date.now();

    const optimisticReply: ReplyItem = {
      id: tempId,
      author: me,
      time: "À l’instant",
      content,
    };

    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, replies: [...c.replies, optimisticReply] } : c
      )
    );

    setReplyingTo(null);
    setReplyContent("");

    try {
      const res = await apiClient.post("/comments", {
        postId: post.id,
        content,
        parentCommentId: id,
      });

      const saved = res.data?.data;

      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === tempId
                    ? {
                        id: String(saved.id),
                        author:
                          saved.user?.profile?.fullName ||
                          saved.user?.email ||
                          "Utilisateur",
                        time: new Date(saved.createdAt).toLocaleString(),
                        content: saved.content,
                      }
                    : r
                ),
              }
            : c
        )
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      // rollback: on retire la reply temp
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, replies: c.replies.filter((r) => r.id !== tempId) }
            : c
        )
      );
    }
  };

  // ----- Like / Unlike d’un commentaire via /reactions -----
  const toggleLikeComment = async (id: string) => {
    const target = comments.find((c) => c.id === id);
    if (!target) return;

    if (!target.liked) {
      // LIKE
      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, liked: true, likes: c.likes + 1 } : c
        )
      );

      try {
        const res = await apiClient.post("/reactions", {
          commentId: id,
          type: "like",
        });

        const savedReaction = res.data?.data;
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  reactionId: savedReaction?.id ?? c.reactionId ?? null,
                }
              : c
          )
        );
      } catch (err) {
        // rollback
        // eslint-disable-next-line no-console
        console.error(err);
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, liked: false, likes: Math.max(0, c.likes - 1) }
              : c
          )
        );
      }

      return;
    }

    // UNLIKE
    if (!target.reactionId) {
      // rien à supprimer côté serveur, just UI
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, liked: false, likes: Math.max(0, c.likes - 1) }
            : c
        )
      );
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: false, likes: Math.max(0, c.likes - 1) }
          : c
      )
    );

    try {
      await apiClient.delete(`/reactions/${target.reactionId}`);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, reactionId: null } : c))
      );
    } catch (err) {
      // rollback
      // eslint-disable-next-line no-console
      console.error(err);
      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, liked: true, likes: c.likes + 1 } : c
        )
      );
    }
  };

  const canDeleteComment = (author: string) => {
    const a = String(author).toLowerCase().trim();
    const m = String(me).toLowerCase().trim();
    return isMyPost || a === m || a === "vous";
  };

  const deleteComment = async (id: string) => {
    const old = comments;
    setComments((prev) => prev.filter((c) => c.id !== id));

    try {
      await apiClient.delete(`/comments/${id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setComments(old); // rollback
    }
  };

  const deleteReply = (cid: string, rid: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === cid
          ? { ...c, replies: c.replies.filter((r) => r.id !== rid) }
          : c
      )
    );
  };

  const deletePost = () => {
    if (onDeletePost) onDeletePost();
    onOpenChange(false);
  };

  // ----- Like / Unlike du post via /reactions -----
  const toggleLikePost = async () => {
    if (!post.id) return;

    if (!postLiked) {
      // LIKE
      setPostLiked(true);
      setPostLikes((prev) => prev + 1);

      try {
        const res = await apiClient.post("/reactions", {
          postId: post.id,
          type: "like",
        });
        const savedReaction = res.data?.data;
        setPostReactionId(savedReaction?.id ?? null);
      } catch (err) {
        // rollback
        // eslint-disable-next-line no-console
        console.error(err);
        setPostLiked(false);
        setPostLikes((prev) => Math.max(0, prev - 1));
      }

      return;
    }

    // UNLIKE
    if (!postReactionId) {
      setPostLiked(false);
      setPostLikes((prev) => Math.max(0, prev - 1));
      return;
    }

    setPostLiked(false);
    setPostLikes((prev) => Math.max(0, prev - 1));

    try {
      await apiClient.delete(`/reactions/${postReactionId}`);
      setPostReactionId(null);
    } catch (err) {
      // rollback
      // eslint-disable-next-line no-console
      console.error(err);
      setPostLiked(true);
      setPostLikes((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 grid grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle>{t("post.comment")}</DialogTitle>
            {isMyPost && (
              <Button variant="destructive" size="sm" onClick={deletePost}>
                <Trash2 className="w-4 h-4 mr-1" />
                {t("common.delete")}
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-full">
          <div className="px-6 py-4 space-y-6">
            {/* Post en haut du dialogue */}
            <div className="border border-border rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initialsOf(post.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">
                    {post.author}
                  </h3>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              {post.emoji && (
                <span className="text-2xl mb-2 block">{post.emoji}</span>
              )}
              <p className="text-sm text-card-foreground mb-4">
                {post.content}
              </p>

              {displayAtt.length > 0 && (
                <div
                  className={`grid gap-2 ${
                    displayAtt.length === 1
                      ? "grid-cols-1"
                      : displayAtt.length === 2
                      ? "grid-cols-2"
                      : displayAtt.length === 3
                      ? "grid-cols-2 sm:grid-cols-3"
                      : "grid-cols-2"
                  }`}
                >
                  {displayAtt.map((src, index) => {
                    const isLast =
                      index === maxDisplay - 1 && totalAtt > maxDisplay;
                    return (
                      <div
                        key={`${src}-${index}`}
                        className="relative rounded-lg overflow-hidden bg-secondary border border-border cursor-pointer"
                        onClick={() =>
                          openViewer(post.attachments || [], index)
                        }
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-32 object-cover"
                        />
                        {isLast && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                              +{totalAtt - maxDisplay}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant={postLiked ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 ${
                    postLiked ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={toggleLikePost}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      postLiked ? "fill-current" : ""
                    }`}
                  />
                  {postLikes}
                </Button>
                <div className="text-xs text-muted-foreground">
                  {comments.length} {t("post.comments", "commentaires")}
                </div>
              </div>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-6 pr-4">
              {loadingComments && (
                <p className="text-xs text-muted-foreground">
                  {t("common.loading") || "Chargement des commentaires..."}
                </p>
              )}

              {!loadingComments &&
                comments.map((c) => {
                  const previews = (c.files || [])
                    .map((f) => getFilePreview(f))
                    .filter((p): p is string => Boolean(p));
                  return (
                    <div key={c.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {initialsOf(c.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {c.author}
                              </span>
                              <span>•</span>
                              <span>{c.time}</span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {canDeleteComment(c.author) && (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => deleteComment(c.id)}
                                  >
                                    {t("common.delete")}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <p className="text-sm mt-1">{c.content}</p>

                          {previews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {previews.map((p, i) => (
                                <div
                                  key={`${c.id}-file-${i}`}
                                  className="w-16 h-16 rounded border overflow-hidden cursor-pointer"
                                  onClick={() => openViewer(previews, i)}
                                >
                                  <img
                                    src={p}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => toggleLikeComment(c.id)}
                            >
                              <Heart
                                className={`w-4 h-4 mr-1 ${
                                  c.liked
                                    ? "fill-destructive text-destructive"
                                    : ""
                                }`}
                              />
                              {c.likes}
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => openReply(c.id)}
                            >
                              <CornerDownRight className="w-4 h-4 mr-1" />
                              {t("post.reply", "Répondre")}
                            </Button> */}
                          </div>

                          {c.replies.length > 0 && (
                            <div className="mt-3 pl-4 border-l">
                              <div className="space-y-3">
                                {c.replies.map((r) => {
                                  const rPreviews = (r.files || [])
                                    .map((f) => getFilePreview(f))
                                    .filter((p): p is string => Boolean(p));
                                  const canDeleteR = canDeleteComment(r.author);
                                  return (
                                    <div
                                      key={r.id}
                                      className="flex items-start gap-3"
                                    >
                                      <Avatar className="h-7 w-7">
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                          {initialsOf(r.author)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <span className="font-medium text-foreground">
                                              {r.author}
                                            </span>
                                            <span>•</span>
                                            <span>{r.time}</span>
                                          </div>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                              >
                                                <MoreHorizontal className="w-4 h-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              {canDeleteR && (
                                                <DropdownMenuItem
                                                  className="text-destructive"
                                                  onClick={() =>
                                                    deleteReply(c.id, r.id)
                                                  }
                                                >
                                                  {t("common.delete")}
                                                </DropdownMenuItem>
                                              )}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>

                                        <p className="text-sm mt-0.5">
                                          {r.content}
                                        </p>

                                        {rPreviews.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {rPreviews.map((p, i) => (
                                              <div
                                                key={`${r.id}-file-${i}`}
                                                className="w-14 h-14 rounded border overflow-hidden cursor-pointer"
                                                onClick={() =>
                                                  openViewer(rPreviews, i)
                                                }
                                              >
                                                <img
                                                  src={p}
                                                  alt=""
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {replyingTo === c.id && (
                            <div className="mt-3 pl-4">
                              <Textarea
                                value={replyContent}
                                onChange={(e) =>
                                  setReplyContent(e.target.value)
                                }
                                placeholder={t("post.writeComment")}
                                className="min-h-[70px] resize-none"
                              />
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="file"
                                  id={`reply-file-${c.id}`}
                                  multiple
                                  accept="image/*,video/*"
                                  className="hidden"
                                  onChange={(e) => onReplyFiles(c.id, e)}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={() =>
                                    document
                                      .getElementById(`reply-file-${c.id}`)
                                      ?.click()
                                  }
                                >
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  {t("post.addMedia")}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => submitReply(c.id)}
                                  disabled={!replyContent.trim()}
                                >
                                  <Send className="w-4 h-4 mr-1" />
                                  {t("post.send")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelReply}
                                >
                                  {t("common.cancel", "Annuler")}
                                </Button>
                              </div>
                              {(replyFiles[c.id]?.length || 0) > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {(replyFiles[c.id] || []).map(
                                    (file, index) => {
                                      const preview = getFilePreview(file);
                                      return preview ? (
                                        <div
                                          key={index}
                                          className="relative group"
                                        >
                                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                                            <img
                                              src={preview}
                                              alt=""
                                              className="w-full h-full object-cover cursor-pointer"
                                              onClick={() =>
                                                openViewer(
                                                  (replyFiles[c.id] || [])
                                                    .map((f) =>
                                                      getFilePreview(f)
                                                    )
                                                    .filter((p): p is string =>
                                                      Boolean(p)
                                                    ),
                                                  index
                                                )
                                              }
                                            />
                                            <button
                                              onClick={() =>
                                                removeReplyFile(c.id, index)
                                              }
                                              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                              aria-label="remove"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          key={index}
                                          className="relative w-16 h-16 rounded-lg border border-border bg-secondary flex items-center justify-center"
                                        >
                                          <Paperclip className="w-4 h-4" />
                                          <button
                                            onClick={() =>
                                              removeReplyFile(c.id, index)
                                            }
                                            className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                                            aria-label="remove"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </ScrollArea>

        {/* Saisie nouveau commentaire */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 mb-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage
                src={
                  (user as any)?.profile?.avatarUrl ||
                  (user as any)?.avatarUrl ||
                  ""
                }
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initialsOf(me)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={t("post.writeComment")}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedFiles.map((file, index) => {
                    const preview = getFilePreview(file);
                    return preview ? (
                      <div key={index} className="relative group">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                          <img
                            src={preview}
                            alt=""
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() =>
                              openViewer(
                                selectedFiles
                                  .map((f) => getFilePreview(f))
                                  .filter((p): p is string => Boolean(p)),
                                index
                              )
                            }
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-lg border border-border bg-secondary flex items-center justify-center"
                      >
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                          aria-label="remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6">
          <div>
            <input
              type="file"
              id="comment-file-input"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document.getElementById("comment-file-input")?.click()
              }
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {t("post.addMedia")}
            </Button>
          </div>
          <Button onClick={handleSubmit} disabled={!commentContent.trim()}>
            <Send className="w-4 h-4 mr-2" />
            {t("post.send")}
          </Button>
        </div>
      </DialogContent>

      {/* Viewer plein écran */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="p-0 max-w-3xl">
          <div className="relative bg-black">
            {viewerImages.length > 0 && (
              <img
                src={viewerImages[viewerIndex]}
                alt=""
                className="w-full h-[70vh] object-contain bg-black"
              />
            )}
            <button
              className="absolute top-2 right-2 bg-white/90 rounded-full p-2"
              onClick={() => setViewerOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
            {viewerImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2"
                  onClick={() =>
                    setViewerIndex(
                      (i) => (i - 1 + viewerImages.length) % viewerImages.length
                    )
                  }
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2"
                  onClick={() =>
                    setViewerIndex((i) => (i + 1) % viewerImages.length)
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default CommentDialog;
