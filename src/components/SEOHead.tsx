import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords,
  ogType = 'website' 
}: SEOHeadProps) => {
  const { t, i18n } = useTranslation();
  
  const seoTitle = title || t('seo.title');
  const seoDescription = description || t('seo.description');
  const seoKeywords = keywords || t('seo.keywords');
  
  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={i18n.language === 'mg' ? 'mg_MG' : i18n.language === 'fr' ? 'fr_FR' : 'en_US'} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
    </Helmet>
  );
};

export default SEOHead;
