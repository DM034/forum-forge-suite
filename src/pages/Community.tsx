import Layout from "@/components/Layout";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/SEOHead";

const Community = () => {
  const { t } = useTranslation();

  const posts = [
    {
      author: "Lucia Schaefer",
      time: "5 mins ago",
      visibility: "Public",
      emoji: "👋",
      content:
        "Salut, je suis designer d'intérieur débutant et je cherche quelqu'un qui voudrait faire un projet ensemble. Quelqu'un d'intéressé ? 👍",
      likes: 187,
      comments: 24,
      shares: 5,
    },
    {
      author: "Raul Jiménez",
      time: "15 mins ago",
      visibility: "Public",
      emoji: "👋",
      content:
        "Salut, je suis designer d'intérieur débutant et je cherche quelqu'un qui voudrait faire un projet ensemble.",
      likes: 142,
      comments: 18,
      shares: 3,
    },
  ];

  const onePhoto = [
    "https://picsum.photos/id/1015/1200/800",
  ];

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
      <SEOHead title="SNMVM — Communauté" description="Publications et activités de la communauté SNMVM" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("community.greeting")}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t("community.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CreatePost />

            {posts.map((post, index) => (
              <PostCard key={`p-base-${index}`} id={`p-base-${index}`} {...post} />
            ))}

            <PostCard
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
            />
          </div>

          <div className="space-y-6">
            <EventCard />
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <h3 className="text-sm font-semibold mb-4">{t("community.resources")}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 rounded-lg p-3 aspect-square flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">{t("community.workspace")}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 aspect-square flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">{t("community.templates")}</span>
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
