import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/SEOHead";

const Dashboard = () => {
  const { t } = useTranslation();
  
  const stats = [
    { title: t('dashboard.totalMembers'), value: "1,234", icon: Users, change: "+12%" },
    { title: t('dashboard.activePosts'), value: "456", icon: MessageSquare, change: "+8%" },
    { title: t('dashboard.engagement'), value: "89%", icon: TrendingUp, change: "+5%" },
    { title: t('dashboard.totalLikes'), value: "12.5K", icon: Heart, change: "+15%" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead title={t('dashboard.title')} />
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-20 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600">{stat.change} {t('dashboard.changeFromLastMonth')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{t('dashboard.newPost')}</p>
                          <p className="text-xs text-muted-foreground">{t('dashboard.hoursAgo')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.popularTopics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Design d'intérieur", "Architecture", "Art numérique", "Photographie"].map((topic, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="text-sm font-medium">{topic}</span>
                        <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 100)} {t('dashboard.posts')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
