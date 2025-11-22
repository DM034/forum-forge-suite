import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

export default function PublishingGuide() {
  const { t } = useTranslation();
  return (
    <Layout>
      <SEOHead title={t("guide.title")} description={t("guide.subtitle")} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("guide.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("guide.subtitle")}</p>
        <div className="grid gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-semibold mb-1">{t("guide.basics.title")}</div>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{t("guide.basics.t1")}</li>
              <li>{t("guide.basics.t2")}</li>
              <li>{t("guide.basics.t3")}</li>
              <li>{t("guide.basics.t4")}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-semibold mb-1">{t("guide.media.title")}</div>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{t("guide.media.t1")}</li>
              <li>{t("guide.media.t2")}</li>
              <li>{t("guide.media.t3")}</li>
              <li>{t("guide.media.t4")}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-semibold mb-1">{t("guide.community.title")}</div>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>{t("guide.community.t1")}</li>
              <li>{t("guide.community.t2")}</li>
              <li>{t("guide.community.t3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
