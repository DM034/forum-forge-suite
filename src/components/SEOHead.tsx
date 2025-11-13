import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogType?: string
  image?: string
  canonical?: string
  noIndex?: boolean
}

const SEOHead = ({
  title,
  description,
  keywords,
  ogType = "website",
  image = "/og-image.jpg",
  canonical,
  noIndex = false
}: SEOHeadProps) => {
  const { t, i18n } = useTranslation()

  const fallbackTitle = "Sendika Nasionalin'ny Mpisehatra Volamena eto Madagasikara — Forum Officiel, Syndicat, Or, Madagascar"
  const fallbackDescription =
    "Forum officiel du Sendika Nasionalin'ny Mpisehatra Volamena eto Madagasikara : informations syndicales, droits des travailleurs de l’or, actualités minières, négociation collective, sécurité, hygiène, environnement, formations et entraide communautaire."
  const fallbackKeywords =
    "sendika, syndicat, mpisehatra volamena, travailleurs de l’or, or, gold, Madagascar, forum, communauté, entraide, informations, actualités, annonces, négociation collective, droit du travail, protection sociale, sécurité minière, hygiène, environnement, RSE, réglementation minière, code minier, CNAPS, OSTIE, santé au travail, fiscalité minière, artisanat minier, orpaillage, coopérative minière, prix de l’or, marché de l’or, exportation, formation, sensibilisation, assemblée générale, cotisation, communication interne, médiation, résolution de conflits, assistance juridique, défense des droits, dialogue social, emploi, conditions de travail, prévention, équipements de protection, conformité, audit, bonnes pratiques, traçabilité, transparence, gouvernance, développement durable"

  const seoTitle = title || t("seo.title", fallbackTitle)
  const seoDescription = description || t("seo.description", fallbackDescription)
  const seoKeywords = keywords || t("seo.keywords", fallbackKeywords)

  const lang = i18n.language || "fr"
  const ogLocale = lang.startsWith("mg") ? "mg_MG" : lang.startsWith("fr") ? "fr_MG" : "en_US"
  const siteName = "Sendika Nasionalin'ny Mpisehatra Volamena eto Madagasikara"

  return (
    <Helmet>
      <html lang={lang} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <meta name="theme-color" content="#7C3AED" />

      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image} />

      {canonical ? <link rel="canonical" href={canonical} /> : null}
    </Helmet>
  )
}

export default SEOHead
