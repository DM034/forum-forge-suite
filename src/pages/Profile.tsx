import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import PostCard from "@/components/PostCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

type SocialLinks = {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
};

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const profile = (user as any)?.profile || (user as any)?.userProfile || {};
  const social: SocialLinks =
    typeof profile?.socialLinks === "string"
      ? JSON.parse(profile.socialLinks)
      : (profile?.socialLinks as SocialLinks) || {};

  const displayName =
    profile?.fullName ||
    (user as any)?.username ||
    ((user as any)?.email ? String((user as any).email).split("@")[0] : "Membre");
  const avatarUrl = profile?.avatarUrl || "";
  const bio =
    profile?.bio ||
    t("profile.defaultBio", "Bienvenue sur mon profil. Heureux de faire partie de la communauté !");
  const location = profile?.location || "Madagascar";
  const website = social?.website || "snmvm.com";

  const joinedAtIso =
    (user as any)?.createdAt || (user as any)?.created_at || new Date().toISOString();
  const joinedAt = new Date(joinedAtIso);
  const joinedLabel = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
  }).format(joinedAt);

  const initials =
    displayName
      .trim()
      .split(" ")
      .map((s: string) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SN";

  const userPosts = [
    {
      author: displayName,
      time: t("profile.justNow", "À l’instant"),
      visibility: "Public",
      content: t(
        "profile.placeholderPost",
        "Ravi d’échanger ici. Partagez vos idées, vos questions et vos expériences."
      ),
      likes: 0,
      comments: 0,
      shares: 0,
    },
  ];

  const stats = {
    posts: (user as any)?.stats?.posts ?? 0,
    followers: (user as any)?.stats?.followers ?? 0,
    following: (user as any)?.stats?.following ?? 0,
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 mx-auto md:mx-0">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full">
                <h1 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">
                  {displayName}
                </h1>
                <p className="text-muted-foreground mb-4 text-center md:text-left text-sm md:text-base">
                  {bio}
                </p>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                    <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{t("profile.joined", "Inscrit en")} {joinedLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {social?.facebook && (
                    <a href={social.facebook} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
                      Facebook
                    </a>
                  )}
                  {social?.twitter && (
                    <a href={social.twitter} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
                      Twitter
                    </a>
                  )}
                  {social?.instagram && (
                    <a href={social.instagram} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
                      Instagram
                    </a>
                  )}
                  {social?.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
                      LinkedIn
                    </a>
                  )}
                </div>
                <div className="mt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
                    {t("profile.title", "Modifier le profil")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{stats.posts}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t("profile.posts", "Publications")}</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{stats.followers}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t("profile.followers", "Abonnés")}</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{stats.following}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t("profile.following", "Abonnements")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-lg md:text-xl font-bold">{t("profile.yourPosts", "Vos publications")}</h2>
          {userPosts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
