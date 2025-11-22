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
  { id: 1, name: "Sarah Johnson", username: "@sarah_j", avatar: "", posts: 156, followers: "2.3K" },
  { id: 2, name: "Michael Chen", username: "@mchen", avatar: "", posts: 89, followers: "1.8K" },
  { id: 3, name: "Emma Wilson", username: "@emmaw", avatar: "", posts: 234, followers: "3.1K" },
  { id: 4, name: "James Brown", username: "@jbrown", avatar: "", posts: 67, followers: "892" },
  { id: 5, name: "Olivia Davis", username: "@olivia_d", avatar: "", posts: 145, followers: "2.1K" },
  { id: 6, name: "Lucas Martinez", username: "@lucas_m", avatar: "", posts: 198, followers: "2.7K" },
  { id: 7, name: "Sophia Garcia", username: "@sophia_g", avatar: "", posts: 312, followers: "4.2K" },
  { id: 8, name: "Daniel Lee", username: "@dan_lee", avatar: "", posts: 78, followers: "1.2K" },
  { id: 9, name: "Isabella Taylor", username: "@bella_t", avatar: "", posts: 189, followers: "2.5K" },
  { id: 10, name: "Ryan Anderson", username: "@ryan_a", avatar: "", posts: 134, followers: "1.9K" },
  { id: 11, name: "Mia Thomas", username: "@mia_t", avatar: "", posts: 221, followers: "3.4K" },
  { id: 12, name: "Ethan White", username: "@ethan_w", avatar: "", posts: 95, followers: "1.5K" },
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
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-card-foreground">{user.posts} publications</div>
                  <div className="text-xs text-muted-foreground">{user.followers} abonnés</div>
                </div>
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
                  <Button
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
                    {/* <span className="hidden sm:inline">
                      {isFollowing ? t("profile.unfollow", "Se désabonner") : t("profile.follow", "S’abonner")}
                    </span> */}
                  </Button>
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
