import { Image, Video, X, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCreatePost } from "@/hooks/usePostsApi";
import { toast } from "sonner";

const CreatePost = () => {
  const { t } = useTranslation();
  const { mutate: createPost, isPending } = useCreatePost();

  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handlePublish = () => {
    if (!postContent.trim() && !postTitle.trim()) {
      toast.error("Veuillez écrire quelque chose");
      return;
    }

    const formData = new FormData();
    formData.append("title", postTitle || "Nouveau post");
    formData.append("content", postContent);

    selectedFiles.forEach(file => {
      formData.append("files", file);
    });
    
    console.log([...formData.entries()].map(([k, v]) => [k, v?.name ?? v]));
    createPost(formData, {
      onSuccess: () => {
        toast.success("Publication créée !");
        setPostContent("");
        setPostTitle("");
        setSelectedFiles([]);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Erreur lors de la publication");
      },
    });
  };

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4">{t("community.createPost")}</h2>

      {/* TITLE */}
    

      {/* CONTENT */}
      <div className="mb-4">
        <textarea
          placeholder={t("community.shareThoughts")}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[80px]"
          rows={3}
        />
      </div>

      {/* FILE PREVIEW */}
      {selectedFiles.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-border bg-secondary">
              {file.type.startsWith("image/") ? (
                <img
                  src={getFilePreview(file) || ""}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 flex flex-col items-center justify-center p-2">
                  <Paperclip className="w-8 h-8 text-muted-foreground mb-1" />
                  <span className="text-xs text-center truncate w-full px-1">{file.name}</span>
                </div>
              )}

              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Image className="w-5 h-5" />
            <span className="text-xs sm:text-sm">{t("community.addFiles")}</span>
          </button>

          {selectedFiles.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedFiles.length} {t("community.filesSelected")}
            </span>
          )}
        </div>

        <Button
          onClick={handlePublish}
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? t("community.publishing") : t("community.publish")}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
