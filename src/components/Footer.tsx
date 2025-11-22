import { Github, Twitter, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 items-start sm:items-center sm:flex-row sm:justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                {t("footer.joinTitle", "Rejoindre la communauté")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("footer.joinSubtitle", "Discutez, posez vos questions et partagez vos idées avec les membres.")}
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
                <Github className="w-4 h-4" />
                {t("footer.github", "GitHub")}
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
                <Twitter className="w-4 h-4" />
                {t("footer.twitter", "Twitter")}
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
                <Mail className="w-4 h-4" />
                {t("footer.newsletter", "Newsletter")}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-semibold">{t("footer.brand", "SNMVM Forum")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer.brandTagline", "Un espace d’entraide et de partage pour apprendre, progresser et construire ensemble une communauté active.")}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" />
              <span>{t("footer.madeWithLove", "Fait avec passion par la communauté")}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footer.navTitle", "Navigation")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary">{t("footer.navHome", "Accueil")}</Link></li>
              <li><Link to="/community" className="hover:text-primary">{t("footer.navPosts", "Publications")}</Link></li>
              <li><Link to="/chat" className="hover:text-primary">{t("footer.navMessages", "Messages")}</Link></li>
              <li><Link to="/profile" className="hover:text-primary">{t("footer.navProfile", "Profil")}</Link></li>
              <li><Link to="/settings" className="hover:text-primary">{t("footer.navSettings", "Paramètres")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footer.resourcesTitle", "Ressources")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/rules" className="hover:text-primary">{t("footer.rules", "Règles de la communauté")}</Link></li>
              <li><Link to="/faq" className="hover:text-primary">{t("footer.faq", "FAQ")}</Link></li>
              <li><Link to="/guide" className="hover:text-primary">{t("footer.guide", "Guide de publication")}</Link></li>
              <li><Link to="/moderation" className="hover:text-primary">{t("footer.moderation", "Modération")}</Link></li>
              <li><Link to="/contact" className="hover:text-primary">{t("footer.contact", "Contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{t("footer.newsTitle", "Newsletter")}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {t("footer.newsSubtitle", "Recevez un résumé mensuel des meilleurs posts et événements.")}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.newsPlaceholder", "Votre e-mail")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="h-10">{t("footer.newsCTA", "S’abonner")}</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {t("footer.brand", "SNMVM Forum")}. {t("footer.rights", "Tous droits réservés.")}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary">{t("footer.privacy", "Confidentialité")}</Link>
            <Link to="/terms" className="hover:text-primary">{t("footer.terms", "Conditions")}</Link>
            <Link to="/cookies" className="hover:text-primary">{t("footer.cookies", "Cookies")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
