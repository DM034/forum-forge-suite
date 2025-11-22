import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mailto = `mailto:contact@snmvm.com?subject=${encodeURIComponent(subject || "Message SNMVM")}&body=${encodeURIComponent(`${name} <${email}>\n\n${message}`)}`;

  return (
    <Layout>
      <SEOHead title={t("contact.title")} description={t("contact.subtitle")} />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("contact.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("contact.subtitle")}</p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("contact.name")}</label>
            <input className="w-full h-11 rounded-lg border border-input bg-background px-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("contact.email")}</label>
            <input className="w-full h-11 rounded-lg border border-input bg-background px-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("contact.subject")}</label>
            <input className="w-full h-11 rounded-lg border border-input bg-background px-3" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("contact.message")}</label>
            <textarea className="w-full min-h-[140px] rounded-lg border border-input bg-background p-3" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <a href={mailto} className="inline-flex items-center justify-center px-4 h-11 rounded-lg bg-primary text-primary-foreground">{t("contact.send")}</a>
            <button type="reset" onClick={() => { setName(""); setEmail(""); setSubject(""); setMessage(""); }} className="px-4 h-11 rounded-lg border border-input">
              {t("common.cancel")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{t("contact.alt")}</p>
        </form>
      </div>
    </Layout>
  );
}
