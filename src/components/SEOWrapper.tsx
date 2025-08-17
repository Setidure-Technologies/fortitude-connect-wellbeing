import React from 'react';

interface SEOWrapperProps {
  title?: string;
  description?: string;
  keywords?: string;
  children: React.ReactNode;
}

export function SEOWrapper({
  title = "Fortitude Network - Cancer Support Community & Resources",
  description = "Join Fortitude Network - A comprehensive cancer support platform connecting patients, survivors, and families. Access AI assistance, community forums, expert resources, and emotional support.",
  keywords = "cancer support, cancer community, cancer patients, cancer survivors, oncology support, cancer care, patient support groups, cancer resources, medical support, emotional support",
  children
}: SEOWrapperProps) {
  React.useEffect(() => {
    // Update document title
    const fullTitle = title.includes("Fortitude Network") ? title : `${title} | Fortitude Network`;
    document.title = fullTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);
  }, [title, description, keywords]);
  
  return <>{children}</>;
}

export default SEOWrapper;