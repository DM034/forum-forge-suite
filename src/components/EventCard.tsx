// src/components/EventCard.tsx
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
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

import chatService from "@/services/apiChat";
import { useAuth } from "@/contexts/AuthContext";

const USERS_PER_PAGE = 6;

// Types alignés sur ton /users
interface UserProfile {
  fullName: string;
  avatarUrl: string;
}

interface User {
  id: string;
  email: string;
  roleId: string;
  profile: UserProfile;
}

const EventCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ?? null;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await chatService.getUsers();
        const data = res.data.data as User[];

        // Optionnel: tu peux filtrer l'utilisateur courant pour ne pas s'afficher lui-même
        const filtered = currentUserId
          ? data.filter((u) => u.id !== currentUserId)
          : data;

        setUsers(filtered);
      } catch (err: any) {
        setError(err?.message ?? "Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUserId]);

  const totalPages = useMemo(
    () => (users.length > 0 ? Math.ceil(users.length / USERS_PER_PAGE) : 1),
    [users.length]
  );

  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage]);

  const getInitials = (u: User) => {
    const source = u.profile?.fullName || u.email || "";
    return source
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        {t("community.users")}
      </h3>

      {loading && (
        <p className="text-sm text-muted-foreground mb-4">
          {t("common.loading") || "Chargement des utilisateurs..."}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 mb-4">
          {error}
        </p>
      )}

      {!loading && !error && currentUsers.length === 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          {t("community.noUsers") || "Aucun utilisateur trouvé."}
        </p>
      )}

      {!loading && !error && currentUsers.length > 0 && (
        <>
          <div className="space-y-4 mb-6">
            {currentUsers.map((u) => {
              const isSelf = currentUserId === u.id;

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/profile/${u.id}`)}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={u.profile.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(u)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        {u.profile.fullName || u.email}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3"
                      title={t("community.message")}
                      disabled={!currentUserId || isSelf}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!currentUserId || isSelf) return;
                        // bouton dynamique : on passe l'ID réel de l'utilisateur dans la query
                        navigate(`/chat?to=${encodeURIComponent(u.id)}`);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {users.length > USERS_PER_PAGE && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={handlePrev} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => handlePageClick(e, page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={handleNext} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default EventCard;
