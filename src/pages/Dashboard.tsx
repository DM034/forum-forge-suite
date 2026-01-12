import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/SEOHead";
import { AdminStaticContent } from "@/pages/AdminStatic";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";

const ADMIN_ROLE_ID = "ROLE001";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const stats = [
    { title: t('dashboard.totalMembers'), value: "23", icon: Users, change: "+12%" },
    { title: t('dashboard.activePosts'), value: "16", icon: MessageSquare, change: "+8%" },
    // { title: t('dashboard.engagement'), value: "89%", icon: TrendingUp, change: "+5%" },
    // { title: t('dashboard.totalLikes'), value: "12.5K", icon: Heart, change: "+15%" },
  ];

  return (
    <Layout>
      <SEOHead title={t('dashboard.title')} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{t('dashboard.title')}</h1>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 md:gap-8 mb-8`}>
          {stats.map((stat, index) => (
            <Card key={index} className={`${stats.length === 2 ? 'min-h-[12rem]' : 'min-h-[9rem]'} transition-all` }>
              <CardHeader className="flex flex-row items-center justify-between py-5 px-5">
                <CardTitle className="text-base md:text-lg font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-6 h-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-8 px-5">
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <p className="text-base text-green-600 mt-2">{stat.change} {t('dashboard.changeFromLastMonth')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{t('dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t('dashboard.newPost')}</p>
                      <p className="text-xs text-muted-foreground">{t('dashboard.hoursAgo')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">{t('dashboard.popularTopics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Design d'intérieur", "Architecture", "Art numérique", "Photographie"].map((topic, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span className="text-sm font-medium truncate">{topic}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{Math.floor(Math.random() * 100)} {t('dashboard.posts')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
      {/* Admin static content inserted below dashboard */}
      <div className="mt-8">
        {/* Admin-only menu */}
        {user && user.roleId === ADMIN_ROLE_ID && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Administration</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col gap-2">
                  <NavLink to="/admin" className="p-2 rounded hover:bg-accent/50">Vue admin</NavLink>
                  <NavLink to="/admin/users" className="p-2 rounded hover:bg-accent/50">Utilisateurs</NavLink>
                  <NavLink to="/admin/static" className="p-2 rounded hover:bg-accent/50">Backoffice</NavLink>
                  <NavLink to="/admin" className="p-2 rounded hover:bg-accent/50">Modération</NavLink>
                </nav>
              </CardContent>
            </Card>
          </div>
        )}

        <AdminStaticContent />
      </div>
    </Layout>
  );
};

export default Dashboard;
