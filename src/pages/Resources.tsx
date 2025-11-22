import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const cards = [
  { to: "/rules", key: "resources.rules" },
  { to: "/faq", key: "resources.faq" },
  { to: "/guide", key: "resources.guide" },
  { to: "/moderation", key: "resources.moderation" },
  { to: "/contact", key: "resources.contact" },
  { to: "/privacy", key: "resources.privacy" },
  { to: "/terms", key: "resources.terms" },
  { to: "/cookies", key: "resources.cookies" }
];

export default function Resources() {
  const { t } = useTranslation();
  return (
    <Layout>
      <SEOHead title={t("resources.title")} description={t("resources.subtitle")} />
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t("resources.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("resources.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link key={c.key} to={c.to} className="group rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{t(c.key)}</h3>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">→</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t(`${c.key}Desc`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
