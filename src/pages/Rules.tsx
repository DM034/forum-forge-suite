import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

export default function Rules() {
  const { t } = useTranslation();
  const items = [
    "rules.respect",
    "rules.noHarassment",
    "rules.noSpam",
    "rules.noIllegal",
    "rules.privacy",
    "rules.safety",
    "rules.minors",
    "rules.misinfo",
    "rules.languages",
    "rules.moderation"
  ];
  return (
    <Layout>
      <SEOHead title={t("rules.title")} description={t("rules.subtitle")} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("rules.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("rules.subtitle")}</p>
        <ol className="space-y-4 list-decimal pl-5">
          {items.map((k) => (
            <li key={k}>
              <div className="font-semibold">{t(`${k}.title`)}</div>
              <p className="text-sm text-muted-foreground">{t(`${k}.desc`)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-xl border border-border p-4 bg-card">
          <div className="font-semibold mb-1">{t("rules.enforcement.title")}</div>
          <p className="text-sm text-muted-foreground">{t("rules.enforcement.desc")}</p>
        </div>
      </div>
    </Layout>
  );
}
