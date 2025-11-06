import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface PostCardProps {
  author: string;
  time: string;
  visibility: string;
  content: string;
  emoji?: string;
  likes: number;
  comments: number;
  shares: number;
  avatarUrl?: string;
}

const PostCard = ({ author, time, visibility, content, emoji, likes, comments, shares, avatarUrl }: PostCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-card-foreground">{author}</h3>
            <p className="text-xs text-muted-foreground">{time} · {visibility}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-4">
        {emoji && <span className="text-2xl mb-2 block">{emoji}</span>}
        <p className="text-card-foreground">{content}</p>
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-border">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{likes} Likes</span>
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">{comments} Comments</span>
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">{shares} Shares</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
