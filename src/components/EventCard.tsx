import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle, UserPlus, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const USERS_PER_PAGE = 6;

const allUsers = [
  { id: 1, name: "Raul Jiménez", username: "@raul_j", avatar: "", posts: 156, followers: "2.3K" },
  { id: 2, name: "Lucia Schaefer", username: "@lucia_s", avatar: "", posts: 89, followers: "1.8K" },
  { id: 3, name: "Équipe Design", username: "@equipe_d", avatar: "", posts: 234, followers: "3.1K" },
  { id: 4, name: "Nadia Ben", username: "@nadia_b", avatar: "", posts: 67, followers: "892" },
  { id: 5, name: "Marco Rossi", username: "@marco_r", avatar: "", posts: 145, followers: "2.1K" },
  { id: 6, name: "Support Modération", username: "@support_m", avatar: "", posts: 198, followers: "2.7K" },
  { id: 7, name: "Aina Rakoto", username: "@aina_r", avatar: "", posts: 312, followers: "4.2K" },
];

const EventCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [following, setFollowing] = useState<Set<number>>(
    () =>
      new Set(
        allUsers.filter(u => typeof window !== "undefined" && localStorage.getItem(`snmvm_follow_${u.id}`) === "1").map(u => u.id)
      )
  );

  const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = allUsers.slice(startIndex, endIndex);

  const toggleFollow = (id: number) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        localStorage.removeItem(`snmvm_follow_${id}`);
      } else {
        next.add(id);
        localStorage.setItem(`snmvm_follow_${id}`, "1");
      }
      return next;
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">{t("community.users")}</h3>

      <div className="space-y-4 mb-6">
        {currentUsers.map(user => {
          const isFollowing = following.has(user.id);
          return (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-card-foreground">{user.name}</h4>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* <div className="text-right hidden sm:block"> */}
                  {/* <div className="text-sm font-medium text-card-foreground">{user.posts} publications</div> */}
                  {/* <div className="text-xs text-muted-foreground">{user.followers} abonnés</div> */}
                {/* </div> */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3"
                    title={t("community.message")}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/chat?to=${user.id}`);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {/* <span className="hidden sm:inline">{t("community.message")}</span> */}
                  </Button>
                  {/* <Button
                    size="sm"
                    variant={isFollowing ? "secondary" : "default"}
                    className="h-8 px-3"
                    title={isFollowing ? t("profile.unfollow", "Se désabonner") : t("profile.follow", "S’abonner")}
                    onClick={e => {
                      e.stopPropagation();
                      toggleFollow(user.id);
                    }}
                  >
                    {isFollowing ? <UserX className="h-4 w-4 mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />}
                    <span className="hidden sm:inline">
                      {isFollowing ? t("profile.unfollow", "Se désabonner") : t("profile.follow", "S’abonner")}
                    </span>
                  </Button> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={e => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={e => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={e => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default EventCard;
