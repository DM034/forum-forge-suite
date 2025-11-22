import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

export default function Moderation() {
  const { t } = useTranslation();
  const roles = ["member", "moderator", "admin"] as const;

  return (
    <Layout>
      <SEOHead title={t("moderation.title")} description={t("moderation.subtitle")} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("moderation.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("moderation.subtitle")}</p>

        <div className="rounded-xl border border-border bg-card p-4 mb-4">
          <div className="font-semibold mb-1">{t("moderation.report.title")}</div>
          <p className="text-sm text-muted-foreground">{t("moderation.report.desc")}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="font-semibold mb-3">{t("moderation.roles.title")}</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {roles.map((r) => {
              const perms = t(`moderation.roles.${r}.perms`, { returnObjects: true }) as unknown as string[];
              return (
                <div key={r} className="rounded-lg border border-border p-3">
                  <div className="font-medium">{t(`moderation.roles.${r}.title`)}</div>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                    {perms.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 mt-4">
          <div className="font-semibold mb-1">{t("moderation.actions.title")}</div>
          <p className="text-sm text-muted-foreground">{t("moderation.actions.desc")}</p>
        </div>
      </div>
    </Layout>
  );
}
