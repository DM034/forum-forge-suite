import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const keys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];

export default function FAQ() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Layout>
      <SEOHead title={t("faq.title")} description={t("faq.subtitle")} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("faq.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("faq.subtitle")}</p>
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k} className="rounded-xl border border-border bg-card">
              <button className="w-full text-left px-4 py-3 font-medium flex items-center justify-between" onClick={() => setOpen(open === k ? null : k)}>
                <span>{t(`faq.${k}.q`)}</span>
                <span className="text-muted-foreground">{open === k ? "−" : "+"}</span>
              </button>
              {open === k && <div className="px-4 pb-4 text-sm text-muted-foreground">{t(`faq.${k}.a`)}</div>}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
