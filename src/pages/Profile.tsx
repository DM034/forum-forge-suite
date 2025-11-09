import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import PostCard from "@/components/PostCard";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const userPosts = [
    {
      author: "Daniel Smith",
      time: "2 hours ago",
      visibility: "Public",
      content: "Je viens de terminer un incroyable projet de design d'intérieur ! Hâte de partager les résultats finaux.",
      likes: 45,
      comments: 12,
      shares: 3,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-20 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      DN
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">Daniel Smith</h1>
                    <p className="text-muted-foreground mb-4">Designer d'intérieur & Passionné de créativité</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <span>portfolio.com</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Inscrit en mars 2024</span>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {t('profile.title')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-sm text-muted-foreground">Publications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1.2K</div>
                    <div className="text-sm text-muted-foreground">Abonnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">342</div>
                    <div className="text-sm text-muted-foreground">Abonnements</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-xl font-bold">Vos publications</h2>
              {userPosts.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
