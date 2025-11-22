import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();
  const sections = ["data", "usage", "legal", "retention", "rights", "security", "cookies", "contact"];
  return (
    <Layout>
      <SEOHead title={t("privacy.title")} description={t("privacy.subtitle")} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("privacy.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("privacy.subtitle")}</p>
        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s} className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold mb-1">{t(`privacy.${s}.title`)}</h2>
              <p className="text-sm text-muted-foreground">{t(`privacy.${s}.desc`)}</p>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
