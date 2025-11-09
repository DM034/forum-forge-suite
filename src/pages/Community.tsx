import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      content: "Salut, je suis designer d'intérieur débutant et je cherche quelqu'un qui voudrait faire un projet ensemble. Quelqu'un d'intéressé ? 👍",
      likes: 187,
      comments: 24,
      shares: 5,
    },
    {
      author: "Raul Jiménez",
      time: "15 mins ago",
      visibility: "Public",
      emoji: "👋",
      content: "Salut, je suis designer d'intérieur débutant et je cherche quelqu'un qui voudrait faire un projet ensemble.",
      likes: 142,
      comments: 18,
      shares: 3,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead />
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-20 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{t('community.greeting')}</h1>
              <p className="text-muted-foreground">
                {t('community.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CreatePost />
                {posts.map((post, index) => (
                  <PostCard key={index} {...post} />
                ))}
              </div>

              <div className="space-y-6">
                <Tabs defaultValue="events" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="events">{t('community.events')}</TabsTrigger>
                    <TabsTrigger value="news">{t('community.news')}</TabsTrigger>
                    <TabsTrigger value="soon">{t('community.soon')}</TabsTrigger>
                  </TabsList>
                </Tabs>

                <EventCard />

                <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold mb-4">{t('community.resources')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{t('community.workspace')}</span>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{t('community.templates')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Community;
