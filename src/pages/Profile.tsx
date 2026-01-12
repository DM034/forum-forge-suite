// src/pages/Profile.tsx
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  SendHorizontal,
} from "lucide-react";
import PostCard from "@/components/PostCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import { useUserPostsApi } from "@/hooks/usePostsApi";

type SocialLinks = {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
};

type ApiProfileUser = {
  id: string;
  email: string;
  roleId: string;
  profile: {
    fullName: string;
    avatarUrl: string;
  };
};

type ApiProfile = {
  id: string;
  userId: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  phone?: string | null;
  socialLinks?: SocialLinks | string | null;
  createdAt: string;
  updatedAt: string;
  user: ApiProfileUser;
};

type ApiAttachment = {
  id: string;
  postId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
};

type ApiPost = {
  id: string;
  userId: string;
  title: string;
  content: string;
  categoryId: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: ApiProfileUser;
  attachments: ApiAttachment[];
  _count: {
    comments: number;
    reactions: number;
  };
  attachmentUrls?: string[];
  myReaction?: {
    id: string;
    type: string;
  } | null;
};

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: routeId } = useParams();

  const currentUserId = (user as any)?.id || (user as any)?.userId || null;

  
  const resolvedRouteId =
  routeId === "me" ? currentUserId : routeId;

  const targetUserId = resolvedRouteId || currentUserId;
  
  const isOwnProfile =
  !!currentUserId &&
  (!resolvedRouteId || String(resolvedRouteId) === String(currentUserId));

  
  const [profileData, setProfileData] = useState<ApiProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);


  const {
    data: userPostsPayload,
    isLoading: loadingPosts,
    error: postsError,
  } = useUserPostsApi(targetUserId, 1, 20);

  const posts: ApiPost[] = (userPostsPayload as any)?.data ?? [];
  // -------- Chargement du profil --------
  useEffect(() => {
    if (!targetUserId) return;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setErrorProfile(null);
        const res = await apiClient.get(`/profiles/${targetUserId}`);
        const data = res.data.data as ApiProfile;
        setProfileData(data);
      } catch (err: any) {
        setErrorProfile(err?.message || "Erreur lors du chargement du profil");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [targetUserId]);

  // -------- Données dérivées --------

  const baseProfile = useMemo(() => {
    if (profileData) return profileData;

    const localProfile =
      (user as any)?.profile || (user as any)?.userProfile || {};
    return {
      fullName: localProfile.fullName,
      bio: localProfile.bio,
      avatarUrl: localProfile.avatarUrl,
      socialLinks: localProfile.socialLinks,
      createdAt:
        (user as any)?.createdAt ||
        (user as any)?.created_at ||
        new Date().toISOString(),
      user: {
        email: (user as any)?.email,
        profile: {
          fullName: localProfile.fullName,
          avatarUrl: localProfile.avatarUrl,
        },
      },
    } as any;
  }, [profileData, user]);
  console.log("Base profile:", baseProfile);

  const social: SocialLinks =
    typeof baseProfile?.socialLinks === "string"
      ? (() => {
          try {
            return JSON.parse(baseProfile.socialLinks) as SocialLinks;
          } catch {
            return {};
          }
        })()
      : (baseProfile?.socialLinks as SocialLinks) || {};

  const displayName =
    baseProfile?.fullName ||
    baseProfile?.user?.profile?.fullName ||
    (baseProfile?.user?.email
      ? String(baseProfile.user.email).split("@")[0]
      : "Membre");

  const avatarUrl =
    baseProfile?.avatarUrl || baseProfile?.user?.profile?.avatarUrl || "";
  const bio =
    baseProfile?.bio ||
    t(
      "profile.defaultBio",
      "Bienvenue sur mon profil. Heureux de faire partie de la communauté !"
    );
  const location = (baseProfile as any)?.location || "Madagascar";
  const website = social?.website || "snmvm.com";

  const joinedAtIso =
    (profileData as any)?.createdAt ||
    (user as any)?.createdAt ||
    (user as any)?.created_at ||
    new Date().toISOString();
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

  // Stats : uniquement les posts
  const stats = {
    posts: posts.length,
  };

  

  // Adaptation des posts pour PostCard
const userPosts = posts.map((post) => {
  // console.log("Post for card:", post);
  const author =
    post.user?.profile?.fullName ||
    post.user?.email ||
    "Membre";

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(post.createdAt));

  return {
    id: post.id,
    authorId: post.user?.id ?? post.userId,   
    author,
    time: dateLabel,
    visibility: "Public",
    content: post.content,
    likes: post._count?.reactions ?? 0,
    comments: post._count?.comments ?? 0,
    shares: 0,
    avatarUrl: post.user?.profile?.avatarUrl || "",

   initialIsLiked: Boolean(post.myReaction),
    initialReactionId: post.myReaction?.id ?? null,

    attachments: post.attachmentUrls ?? [],
  };
});



  const goEdit = () => navigate("/settings");

  const goMessage = () => {
    if (!targetUserId || isOwnProfile || !currentUserId) return;
    navigate(`/chat?to=${encodeURIComponent(String(targetUserId))}`);
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
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">
                      {displayName}
                    </h1>

                    {loadingProfile && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("common.loading") || "Chargement du profil..."}
                      </p>
                    )}
                    {errorProfile && (
                      <p className="text-xs text-red-500 mb-2">
                        {errorProfile}
                      </p>
                    )}

                    <p className="text-muted-foreground mb-4 text-center md:text-left text-sm md:text-base">
                      {bio}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 justify-center md:justify-end">
                    {isOwnProfile ? (
                      <Button
                        onClick={goEdit}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {t("profile.editButton", "Modifier le profil")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={goMessage}
                        disabled={!currentUserId || !targetUserId}
                      >
                        <SendHorizontal className="w-4 h-4 mr-2" />
                        {t("community.message", "Message")}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-4 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={
                        website.startsWith("http")
                          ? website
                          : `https://${website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {t("profile.joined", "Inscrit en")} {joinedLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {social?.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                  {social?.twitter && (
                    <a
                      href={social.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  {social?.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {social?.linkedin && (
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats : uniquement les publications */}
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">
                  {stats.posts}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {t("profile.posts", "Publications")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 mb-10">
          <h2 className="text-lg md:text-xl font-bold">
            {isOwnProfile
              ? t("profile.yourPosts", "Vos publications")
              : t("profile.userPosts", "Publications")}
          </h2>

          {loadingPosts && (
            <p className="text-sm text-muted-foreground">
              {t("common.loading") || "Chargement des publications..."}
            </p>
          )}
          {postsError && (
            <p className="text-sm text-red-500">
              {String((postsError as any)?.message || postsError)}
            </p>
          )}

          {!loadingPosts && !postsError && userPosts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("profile.noPosts", "Aucune publication pour le moment.")}
            </p>
          )}

          {!loadingPosts &&
            !postsError &&
            userPosts.map((post) =>  <PostCard
                key={post.id}
                {...post}
              />)}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
