import { useState } from "react";
import { X, Image as ImageIcon, Send } from "lucide-react";
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

const CommentDialog = ({ open, onOpenChange, post }: CommentDialogProps) => {
  const { t } = useTranslation();
  const [commentContent, setCommentContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleSubmit = () => {
    // Handle comment submission
    console.log("Comment:", commentContent, "Files:", selectedFiles);
    setCommentContent("");
    setSelectedFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>{t('post.comment')}</DialogTitle>
        </DialogHeader>
        
        {/* Original Post - Fixed at top */}
        <div className="px-6 pb-6 border-b border-border flex-shrink-0">
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author.split(' ').map(n => n[0]).join('')}
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
            <div className={`grid gap-2 ${
              post.attachments.length === 1 ? 'grid-cols-1' : 
              post.attachments.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2 sm:grid-cols-3'
            }`}>
              {post.attachments.map((attachment, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden bg-secondary border border-border">
                  <img 
                    src={attachment} 
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section - Scrollable */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4 pr-4">
            {/* Existing comments would go here */}
            <div className="text-sm text-muted-foreground text-center py-4">
              {t('post.noComments') || 'Pas encore de commentaires'}
            </div>
          </div>
        </ScrollArea>

        {/* Comment Input - Fixed at bottom */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0">
          <div className="flex gap-3 mb-4">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={t('post.writeComment')}
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

        <div className="flex items-center justify-between px-6 pb-6 flex-shrink-0">
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
              onClick={() => document.getElementById('comment-file-input')?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {t('post.addMedia')}
            </Button>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!commentContent.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            {t('post.send')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
