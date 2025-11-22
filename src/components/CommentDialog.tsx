import { useState } from "react";
import { X, Image as ImageIcon, Send, CornerDownRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "./ui/scroll-area";

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
  };
}

type ReplyItem = {
  id: string;
  author: string;
  time: string;
  content: string;
};

type CommentItem = {
  id: number;
  author: string;
  time: string;
  content: string;
  replies: ReplyItem[];
};

const CommentDialog = ({ open, onOpenChange, post }: CommentDialogProps) => {
  const { t } = useTranslation();
  const [commentContent, setCommentContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comments, setComments] = useState<CommentItem[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      author: `Membre ${i + 1}`,
      time: `${i + 1} min`,
      content: `${i + 1}`,
      replies: [],
    }))
  );
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) return URL.createObjectURL(file);
    return null;
  };

  const handleSubmit = () => {
    if (!commentContent.trim()) return;
    const item: CommentItem = {
      id: Date.now(),
      author: "Vous",
      time: t("profile.justNow", "À l’instant"),
      content: commentContent.trim(),
      replies: [],
    };
    setComments((prev) => [item, ...prev]);
    setCommentContent("");
    setSelectedFiles([]);
  };

  const openReply = (id: number) => {
    setReplyingTo(id);
    setReplyContent("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const submitReply = (id: number) => {
    if (!replyContent.trim()) return;
    const reply: ReplyItem = {
      id: `${id}-${Date.now()}`,
      author: "Vous",
      time: t("profile.justNow", "À l’instant"),
      content: replyContent.trim(),
    };
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, replies: [...c.replies, reply] } : c))
    );
    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 grid grid-rows-[auto_auto_minmax(0,1fr)_auto_auto] overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{t("post.comment")}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 border-b border-border">
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">{post.author}</h3>
              <p className="text-xs text-muted-foreground">{post.time}</p>
            </div>
          </div>

          {post.emoji && <span className="text-2xl mb-2 block">{post.emoji}</span>}

          <p className="text-sm text-card-foreground mb-4">{post.content}</p>

          {post.attachments && post.attachments.length > 0 && (
            <div
              className={`grid gap-2 ${
                post.attachments.length === 1
                  ? "grid-cols-1"
                  : post.attachments.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3"
              }`}
            >
              {post.attachments.map((attachment, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden bg-secondary border border-border">
                  <img src={attachment} alt={`Attachment ${index + 1}`} className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <ScrollArea className="px-6 py-4 h-full">
          <div className="space-y-6 pr-4">
            {comments.map((c) => (
              <div key={c.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {c.author.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{c.author}</span>
                      <span>•</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-sm mt-1">{c.content}</p>
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => openReply(c.id)}
                      >
                        <CornerDownRight className="w-4 h-4 mr-1" />
                        {t("post.reply", "Répondre")}
                      </Button>
                    </div>

                    {c.replies.length > 0 && (
                      <div className="mt-3 pl-4 border-l">
                        <div className="space-y-3">
                          {c.replies.map((r) => (
                            <div key={r.id} className="flex items-start gap-3">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                  {r.author.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <span className="font-medium text-foreground">{r.author}</span>
                                  <span>•</span>
                                  <span>{r.time}</span>
                                </div>
                                <p className="text-sm mt-0.5">{r.content}</p>
                              </div>
                            </div>
                          ))}
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border">
          <div className="flex gap-3 mb-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">U</AvatarFallback>
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
                    return (
                      <div key={index} className="relative group">
                        {preview ? (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                            <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative w-20 h-20 rounded-lg border border-border bg-secondary flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            <button
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
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
              onClick={() => document.getElementById("comment-file-input")?.click()}
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
    </Dialog>
  );
};

export default CommentDialog;
