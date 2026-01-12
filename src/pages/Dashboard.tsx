import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/SEOHead";
import { AdminStaticContent } from "@/pages/AdminStatic";

const Dashboard = () => {
  const { t } = useTranslation();
  
  const stats = [
    { title: t('dashboard.totalMembers'), value: "23", icon: Users, change: "+12%" },
    { title: t('dashboard.activePosts'), value: "16", icon: MessageSquare, change: "+8%" },
    // { title: t('dashboard.engagement'), value: "89%", icon: TrendingUp, change: "+5%" },
    // { title: t('dashboard.totalLikes'), value: "12.5K", icon: Heart, change: "+15%" },
  ];

  return (
    <Layout>
      <SEOHead title={t('dashboard.title')} />
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t('dashboard.title')}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 md:gap-8`}>
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`${stats.length === 2 ? 'min-h-[12rem]' : 'min-h-[9rem]'} 
                group relative overflow-hidden transition-all duration-300 
                hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1
                border-border/50 bg-gradient-to-br from-card to-card/80`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-row items-center justify-between py-5 px-6 relative">
                <CardTitle className="text-base md:text-lg font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="py-6 px-6 relative">
                <div className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {stat.change} {t('dashboard.changeFromLastMonth')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin static content */}
        <div className="pt-4">
          <AdminStaticContent />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
