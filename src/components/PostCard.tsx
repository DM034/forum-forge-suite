import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CommentDialog from "./CommentDialog";
import { useReaction } from "@/hooks/useReactions";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent } from "./ui/dialog";

interface PostCardProps {
  id?: string | number;
  author: string;
  time: string;
  visibility: string;
  content: string;
  emoji?: string;
  likes: number;
  comments: number;
  shares: number;
  avatarUrl?: string;
  initialIsLiked?: boolean;
  initialReactionId?: string | null;
  attachments?: string[];
  onDelete?: () => void;
}

const PostCard = ({
  id,
  author,
  time,
  visibility,
  content,
  emoji,
  likes,
  comments,
  shares,
  avatarUrl,
  initialIsLiked,
  initialReactionId,
  attachments,
  onDelete,
}: PostCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [reactionId, setReactionId] = useState<string | null>(
    initialReactionId || null
  );

  const { react, unreact } = useReaction();
  const [likeCount, setLikeCount] = useState(likes);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const me =
    (user as any)?.fullName ||
    (user as any)?.username ||
    ((user as any)?.email ? String((user as any).email).split("@")[0] : "Vous");

  const isMyPost =
    String(author).toLowerCase().trim() === String(me).toLowerCase().trim() ||
    String(author).toLowerCase().trim() === "vous";

  const postId = useMemo(
    () => String(id ?? encodeURIComponent(`${author}-${time}`)),
    [id, author, time]
  );

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    if (qs.get("openPost") === postId && qs.get("openComments") === "1") {
      setCommentDialogOpen(true);
    }
  }, [location.search, postId]);

  useEffect(() => {
    setIsLiked(initialIsLiked || false);
    setReactionId(initialReactionId || null);
  }, [initialIsLiked, initialReactionId]);

  const handleLike = () => {
    if (!isLiked) {
      // Optimistic UI
      setIsLiked(true);
      setLikeCount((c) => c + 1);

      react.mutate(id, {
        onSuccess: (res) => {
          setReactionId(res.data.data.id); // stocker le reactionId
        },
        onError: () => {
          // rollback
          setIsLiked(false);
          setLikeCount((c) => c - 1);
        },
      });

      return;
    }

    // === UNLIKE ===
    if (reactionId) {
      setIsLiked(false);
      setLikeCount((c) => c - 1);

      unreact.mutate(reactionId, {
        onSuccess: () => {
          setReactionId(null);
        },
        onError: () => {
          // rollback
          setIsLiked(true);
          setLikeCount((c) => c + 1);
        },
      });
    }
  };

  const openComments = () => {
    const qs = new URLSearchParams(location.search);
    qs.set("openPost", postId);
    qs.set("openComments", "1");
    navigate(`${location.pathname}?${qs.toString()}`);
    setCommentDialogOpen(true);
  };

  const onDialogOpenChange = (open: boolean) => {
    setCommentDialogOpen(open);
    const qs = new URLSearchParams(location.search);
    if (open) {
      qs.set("openPost", postId);
      qs.set("openComments", "1");
      navigate(`${location.pathname}?${qs.toString()}`, { replace: true });
    } else {
      qs.delete("openPost");
      qs.delete("openComments");
      const next = qs.toString();
      navigate(next ? `${location.pathname}?${next}` : location.pathname, {
        replace: true,
      });
    }
  };

  const total = attachments?.length ?? 0;
  const maxDisplay = 4;
  const display = (attachments ?? []).slice(0, maxDisplay);
  const gridCols =
    display.length === 1
      ? "grid-cols-1"
      : display.length === 2
      ? "grid-cols-2"
      : display.length === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2";

  const openViewerAt = (idx: number) => {
    if (!attachments || attachments.length === 0) return;
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const deletePostHere = () => {
    if (onDelete) onDelete();
    else setHidden(true);
  };

  if (hidden) return null;

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-start gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/profile")}
        >
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-card-foreground">
              {author}
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {time} · {visibility}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isMyPost && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={deletePostHere}
              >
                {t("common.delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        {emoji && (
          <span className="text-xl sm:text-2xl mb-2 block">{emoji}</span>
        )}
        <p className="text-sm sm:text-base text-card-foreground">{content}</p>
      </div>

      {display.length > 0 && (
        <div className={`mb-4 grid gap-2 ${gridCols}`}>
          {display.map((src, index) => {
            const isLastWithMore =
              index === maxDisplay - 1 && total > maxDisplay;
            return (
              <div
                key={`${src}-${index}`}
                className="relative rounded-lg overflow-hidden bg-secondary border border-border group cursor-pointer"
                onClick={() => openViewerAt(index)}
              >
                <img
                  src={src}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isLastWithMore && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl sm:text-2xl font-semibold">
                      +{total - maxDisplay}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 md:gap-6 pt-4 border-t border-border">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 transition-colors ${
            isLiked
              ? "text-destructive"
              : "text-muted-foreground hover:text-destructive"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-destructive" : ""}`} />
          <span className="text-xs sm:text-sm">
            {likeCount} {t("post.like")}
          </span>
        </button>
        <button
          onClick={openComments}
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs sm:text-sm">
            {comments} {t("post.comment")}
          </span>
        </button>
      </div>

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={onDialogOpenChange}
        post={{ author, time, content, emoji, avatarUrl, attachments }}
        onDeletePost={deletePostHere}
      />

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="p-0 max-w-3xl">
          <div className="relative bg-black">
            {attachments && attachments.length > 0 && (
              <img
                src={attachments[viewerIndex]}
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
            {attachments && attachments.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2"
                  onClick={() =>
                    setViewerIndex((i) =>
                      attachments
                        ? (i - 1 + attachments.length) % attachments.length
                        : 0
                    )
                  }
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2"
                  onClick={() =>
                    setViewerIndex((i) =>
                      attachments ? (i + 1) % attachments.length : 0
                    )
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostCard;
