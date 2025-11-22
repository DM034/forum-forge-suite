import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  const sections = ["accounts", "content", "license", "acceptableUse", "disclaimer", "changes", "contact"];
  return (
    <Layout>
      <SEOHead title={t("terms.title")} description={t("terms.subtitle")} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("terms.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("terms.subtitle")}</p>
        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s} className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold mb-1">{t(`terms.${s}.title`)}</h2>
              <p className="text-sm text-muted-foreground">{t(`terms.${s}.desc`)}</p>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
