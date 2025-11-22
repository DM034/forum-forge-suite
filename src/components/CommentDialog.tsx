import { useState, useMemo } from "react";
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

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    author: string;
    time: string;
    content: string;
    emoji?: string;
    avatarUrl?: string;
    attachments?: string[];
    likes?: number;
    liked?: boolean;
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
  id: number;
  author: string;
  time: string;
  content: string;
  replies: ReplyItem[];
  likes: number;
  liked: boolean;
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

const CommentDialog = ({ open, onOpenChange, post, onDeletePost }: CommentDialogProps) => {
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
  const [comments, setComments] = useState<CommentItem[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      author: `Membre ${i + 1}`,
      time: `${i + 1} min`,
      content: `${i + 1}`,
      replies: [],
      likes: 0,
      liked: false,
    }))
  );
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyFiles, setReplyFiles] = useState<Record<number, File[]>>({});

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const [postLiked, setPostLiked] = useState<boolean>(!!post.liked);
  const [postLikes, setPostLikes] = useState<number>(post.likes ?? 0);

  const maxDisplay = 4;
  const totalAtt = post.attachments?.length ?? 0;
  const displayAtt = (post.attachments || []).slice(0, maxDisplay);

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

  const handleSubmit = () => {
    if (!commentContent.trim()) return;
    const item: CommentItem = {
      id: Date.now(),
      author: me,
      time: t("profile.justNow", "À l’instant"),
      content: commentContent.trim(),
      replies: [],
      likes: 0,
      liked: false,
      files: selectedFiles,
    };
    setComments((prev) => [item, ...prev]);
    setCommentContent("");
    setSelectedFiles([]);
  };

  const openReply = (id: number) => {
    setReplyingTo(id);
    setReplyContent("");
    setReplyFiles((p) => ({ ...p, [id]: [] }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const onReplyFiles = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setReplyFiles((p) => ({ ...p, [id]: Array.from(e.target.files) }));
  };

  const removeReplyFile = (cid: number, index: number) => {
    setReplyFiles((p) => {
      const next = (p[cid] || []).filter((_, i) => i !== index);
      return { ...p, [cid]: next };
    });
  };

  const submitReply = (id: number) => {
    if (!replyContent.trim()) return;
    const r: ReplyItem = {
      id: `${id}-${Date.now()}`,
      author: me,
      time: t("profile.justNow", "À l’instant"),
      content: replyContent.trim(),
      files: replyFiles[id] || [],
    };
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, replies: [...c.replies, r] } : c)));
    setReplyingTo(null);
    setReplyContent("");
    setReplyFiles((p) => ({ ...p, [id]: [] }));
  };

  const toggleLikeComment = (id: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
      )
    );
  };

  const canDeleteComment = (author: string) => {
    const a = String(author).toLowerCase().trim();
    const m = String(me).toLowerCase().trim();
    return isMyPost || a === m || a === "vous";
  };

  const deleteComment = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteReply = (cid: number, rid: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === cid ? { ...c, replies: c.replies.filter((r) => r.id !== rid) } : c))
    );
  };

  const deletePost = () => {
    if (onDeletePost) onDeletePost();
    onOpenChange(false);
  };

  const toggleLikePost = () => {
    setPostLiked((prev) => !prev);
    setPostLikes((prev) => (postLiked ? Math.max(0, prev - 1) : prev + 1));
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
            <div className="border border-border rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initialsOf(post.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{post.author}</h3>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              {post.emoji && <span className="text-2xl mb-2 block">{post.emoji}</span>}
              <p className="text-sm text-card-foreground mb-4">{post.content}</p>
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
                    const isLast = index === maxDisplay - 1 && totalAtt > maxDisplay;
                    return (
                      <div
                        key={`${src}-${index}`}
                        className="relative rounded-lg overflow-hidden bg-secondary border border-border cursor-pointer"
                        onClick={() => openViewer(post.attachments || [], index)}
                      >
                        <img src={src} alt="" className="w-full h-32 object-cover" />
                        {isLast && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">+{totalAtt - maxDisplay}</span>
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
                  className={`h-8 ${postLiked ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={toggleLikePost}
                >
                  <Heart className={`w-4 h-4 mr-1 ${postLiked ? "fill-current" : ""}`} />
                  {postLikes}
                </Button>
                <div className="text-xs text-muted-foreground">
                  {comments.length} {t("post.comments", "commentaires")}
                </div>
              </div>
            </div>

            <div className="space-y-6 pr-4">
              {comments.map((c) => {
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
                            <span className="font-medium text-foreground">{c.author}</span>
                            <span>•</span>
                            <span>{c.time}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canDeleteComment(c.author) && (
                                <DropdownMenuItem className="text-destructive" onClick={() => deleteComment(c.id)}>
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
                                <img src={p} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => toggleLikeComment(c.id)}>
                            <Heart className={`w-4 h-4 mr-1 ${c.liked ? "fill-destructive text-destructive" : ""}`} />
                            {c.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openReply(c.id)}>
                            <CornerDownRight className="w-4 h-4 mr-1" />
                            {t("post.reply", "Répondre")}
                          </Button>
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
                                  <div key={r.id} className="flex items-start gap-3">
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                        {initialsOf(r.author)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                          <span className="font-medium text-foreground">{r.author}</span>
                                          <span>•</span>
                                          <span>{r.time}</span>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                              <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            {canDeleteR && (
                                              <DropdownMenuItem className="text-destructive" onClick={() => deleteReply(c.id, r.id)}>
                                                {t("common.delete")}
                                              </DropdownMenuItem>
                                            )}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>

                                      <p className="text-sm mt-0.5">{r.content}</p>

                                      {rPreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {rPreviews.map((p, i) => (
                                            <div
                                              key={`${r.id}-file-${i}`}
                                              className="w-14 h-14 rounded border overflow-hidden cursor-pointer"
                                              onClick={() => openViewer(rPreviews, i)}
                                            >
                                              <img src={p} alt="" className="w-full h-full object-cover" />
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
                              onChange={(e) => setReplyContent(e.target.value)}
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
                              <Button variant="ghost" size="sm" className="h-8" onClick={() => document.getElementById(`reply-file-${c.id}`)?.click()}>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                {t("post.addMedia")}
                              </Button>
                              <Button size="sm" onClick={() => submitReply(c.id)} disabled={!replyContent.trim()}>
                                <Send className="w-4 h-4 mr-1" />
                                {t("post.send")}
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelReply}>
                                {t("common.cancel", "Annuler")}
                              </Button>
                            </div>
                            {(replyFiles[c.id]?.length || 0) > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {(replyFiles[c.id] || []).map((file, index) => {
                                  const preview = getFilePreview(file);
                                  return preview ? (
                                    <div key={index} className="relative group">
                                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                                        <img
                                          src={preview}
                                          alt=""
                                          className="w-full h-full object-cover cursor-pointer"
                                          onClick={() =>
                                            openViewer(
                                              (replyFiles[c.id] || [])
                                                .map((f) => getFilePreview(f))
                                                .filter((p): p is string => Boolean(p)),
                                              index
                                            )
                                          }
                                        />
                                        <button
                                          onClick={() => removeReplyFile(c.id, index)}
                                          className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          aria-label="remove"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div key={index} className="relative w-16 h-16 rounded-lg border border-border bg-secondary flex items-center justify-center">
                                      <Paperclip className="w-4 h-4" />
                                      <button
                                        onClick={() => removeReplyFile(c.id, index)}
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
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 mb-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={(user as any)?.profile?.avatarUrl || (user as any)?.avatarUrl || ""} />
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
                      <div key={index} className="relative w-20 h-20 rounded-lg border border-border bg-secondary flex items-center justify-center">
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
            <Button variant="ghost" size="sm" onClick={() => document.getElementById("comment-file-input")?.click()}>
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

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="p-0 max-w-3xl">
          <div className="relative bg-black">
            {viewerImages.length > 0 && (
              <img src={viewerImages[viewerIndex]} alt="" className="w-full h-[70vh] object-contain bg-black" />
            )}
            <button className="absolute top-2 right-2 bg-white/90 rounded-full p-2" onClick={() => setViewerOpen(false)}>
              <X className="w-4 h-4" />
            </button>
            {viewerImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2"
                  onClick={() => setViewerIndex((i) => (i - 1 + viewerImages.length) % viewerImages.length)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2"
                  onClick={() => setViewerIndex((i) => (i + 1) % viewerImages.length)}
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
