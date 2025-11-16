import { Heart, MessageSquare, Share2, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

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
  attachments?: string[];
}

const PostCard = ({ author, time, visibility, content, emoji, likes, comments, shares, avatarUrl, attachments }: PostCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
              {author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-card-foreground">{author}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{time} · {visibility}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-4">
        {emoji && <span className="text-xl sm:text-2xl mb-2 block">{emoji}</span>}
        <p className="text-sm sm:text-base text-card-foreground">{content}</p>
      </div>

      {attachments && attachments.length > 0 && (
        <div className={`mb-4 grid gap-2 ${
          attachments.length === 1 ? 'grid-cols-1' : 
          attachments.length === 2 ? 'grid-cols-2' : 
          'grid-cols-2 sm:grid-cols-3'
        }`}>
          {attachments.map((attachment, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden bg-secondary border border-border group">
              <img 
                src={attachment} 
                alt={`Attachment ${index + 1}`}
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 md:gap-6 pt-4 border-t border-border">
        <button className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-destructive transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{likes} {t('post.like')}</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-primary transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{comments} {t('post.comment')}</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{shares} {t('post.share')}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
