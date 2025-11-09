import { Image, Video } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CreatePost = () => {
  const { t } = useTranslation();
  const [postContent, setPostContent] = useState("");

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4">{t('community.createPost')}</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder={t('community.shareThoughts')}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Image className="w-5 h-5" />
            <span className="text-sm">{t('community.addImage')}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Video className="w-5 h-5" />
            <span className="text-sm">Vidéo</span>
          </button>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {t('community.publish')}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
