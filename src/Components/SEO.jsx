import { useEffect } from 'react';

const SEO = ({
    title = 'Zameen - Property Portal in Pakistan | Buy, Sell & Rent Properties',
    description = 'Find properties for sale and rent in Pakistan. Browse houses, plots, commercial properties, and new projects across Karachi, Lahore, Islamabad, and other major cities.',
    keywords = 'property Pakistan, real estate, houses for sale, plots, commercial property, rent, Karachi, Lahore, Islamabad',
    ogImage = '/og-default.jpg',
    ogType = 'website',
    canonicalUrl,
    structuredData,
    noindex = false
}) => {
    useEffect(() => {
        const siteUrl = window.location.origin;
        const fullUrl = canonicalUrl || window.location.href;
        const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

        // Update title
        document.title = title;

        // Helper to update or create meta tag
        const updateMeta = (selector, attribute, value) => {
            let element = document.querySelector(selector);
            if (!element) {
                element = document.createElement('meta');
                if (selector.includes('property')) {
                    element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
                } else if (selector.includes('name')) {
                    element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
                }
                document.head.appendChild(element);
            }
            element.setAttribute('content', value);
        };

        // Update all meta tags
        updateMeta('meta[name="description"]', 'content', description);
        updateMeta('meta[name="keywords"]', 'content', keywords);
        updateMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');

        // Open Graph
        updateMeta('meta[property="og:type"]', 'content', ogType);
        updateMeta('meta[property="og:url"]', 'content', fullUrl);
        updateMeta('meta[property="og:title"]', 'content', title);
        updateMeta('meta[property="og:description"]', 'content', description);
        updateMeta('meta[property="og:image"]', 'content', fullImageUrl);

        // Twitter
        updateMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
        updateMeta('meta[name="twitter:title"]', 'content', title);
        updateMeta('meta[name="twitter:description"]', 'content', description);
        updateMeta('meta[name="twitter:image"]', 'content', fullImageUrl);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', fullUrl);
        } else if (canonical) {
            canonical.remove();
        }

        // Structured Data
        let scriptTag = document.querySelector('script[type="application/ld+json"]');
        if (structuredData) {
            if (!scriptTag) {
                scriptTag = document.createElement('script');
                scriptTag.setAttribute('type', 'application/ld+json');
                document.head.appendChild(scriptTag);
            }
            scriptTag.textContent = JSON.stringify(structuredData);
        } else if (scriptTag) {
            scriptTag.remove();
        }

        // Cleanup function
        return () => {
            // Reset to default on unmount
            document.title = 'Zameen - Property Portal in Pakistan';
        };
    }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData, noindex]);

    return null; // This component doesn't render anything
};

export default SEO;
