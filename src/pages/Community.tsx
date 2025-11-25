import Layout from "@/components/Layout";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import { usePostsApi } from "@/hooks/usePostsApi";

const Community = () => {
  const { t } = useTranslation();
  const { user } = useAuth() as any;

  const displayName =
    user?.fullName ||
    user?.username ||
    (user?.email ? String(user.email).split("@")[0] : "Utilisateur");

  const greetTemplate = t("community.greeting");
  const greeting = greetTemplate.includes("{name}")
    ? greetTemplate.replace("{name}", displayName)
    : greetTemplate.replace(/Daniel/gi, displayName);
  const { data, isLoading, isError } = usePostsApi(1, 10);

  const posts = data?.data?.data || [];

  const onePhoto = ["https://picsum.photos/id/1015/1200/800"];

  const threePhotos = [
    "https://picsum.photos/id/1011/1000/700",
    "https://picsum.photos/id/1012/1000/700",
    "https://picsum.photos/id/1020/1000/700",
  ];

  const tenPhotos = [
    "https://picsum.photos/id/1003/800/600",
    "https://picsum.photos/id/1025/800/600",
    "https://picsum.photos/id/1000/800/600",
    "https://picsum.photos/id/1001/800/600",
    "https://picsum.photos/id/1002/800/600",
    "https://picsum.photos/id/1004/800/600",
    "https://picsum.photos/id/1016/800/600",
    "https://picsum.photos/id/1018/800/600",
    "https://picsum.photos/id/1024/800/600",
    "https://picsum.photos/id/1035/800/600",
  ];

  return (
    <Layout>
      <SEOHead
        title="SNMVM — Communauté"
        description="Publications et activités de la communauté SNMVM"
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{greeting}</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t("community.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CreatePost />

            {isLoading && <p className="text-center py-4">Chargement…</p>}

            {isError && (
              <p className="text-center py-4 text-red-500">
                Une erreur est survenue lors du chargement des posts.
              </p>
            )}

            {posts.map((p, index) => (
              <PostCard
                key={p.id}
                id={p.id}
                author={p.user?.profile?.fullName || "Utilisateur"}
                time={new Date(p.createdAt).toLocaleString()}
                visibility="Public"
                content={p.content}
                likes={p._count?.reactions || 0}
                comments={p._count?.comments || 0}
                shares={0}
                initialIsLiked={Boolean(p.myReaction)}
                initialReactionId={p.myReaction?.id}
                attachments={p.attachments?.map((a) => a.fileUrl) || []}
              />
            ))}

            {/* <PostCard
              id="p-photo-1"
              author="SNMVM"
              time="À l’instant"
              visibility="Public"
              content="Annonce de la journée communautaire. Partagez vos idées et vos photos."
              likes={12}
              comments={3}
              shares={1}
              attachments={onePhoto}
            />

            <PostCard
              id="p-photo-3"
              author="Comité SNMVM"
              time="Il y a 1 h"
              visibility="Public"
              content="Retour en images sur notre atelier. Merci à tous les participants."
              likes={42}
              comments={9}
              shares={5}
              attachments={threePhotos}
            />

            <PostCard
              id="p-photo-10"
              author="Membres SNMVM"
              time="Hier"
              visibility="Public"
              content="Galerie photo des dernières rencontres. Identifiez vos amis et laissez un commentaire."
              likes={128}
              comments={24}
              shares={12}
              attachments={tenPhotos}
            /> */}
          </div>

          <div className="space-y-6">
            <EventCard />
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <h3 className="text-sm font-semibold mb-4">
                {t("community.resources")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 rounded-lg p-3 aspect-square flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {t("community.workspace")}
                  </span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 aspect-square flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {t("community.templates")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
