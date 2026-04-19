import { API_BASE_URL } from '../config';

// SEO Utility Functions

export const generatePropertyStructuredData = (property) => {
    if (!property) return null;

    const price = property.price || property.priceRange?.min;
    const image = property.thumbnail || property.mainImage || property.images?.[0];
    const fullImage = image?.startsWith('http') ? image : `${API_BASE_URL}/${image}`;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": property.title || property.name,
        "description": property.description || `${property.propertyType} for ${property.purpose} in ${property.city}`,
        "image": fullImage,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "PKR",
            "price": price,
            "availability": "https://schema.org/InStock",
            "url": `http://localhost:5173/property/${property.slug || property._id}`
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": property.areaName || property.location,
            "addressRegion": property.city,
            "addressCountry": "PK"
        }
    };
};

export const generateListingStructuredData = (properties, city, purpose) => {
    if (!properties || properties.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Properties for ${purpose} in ${city}`,
        "description": `Browse ${properties.length} properties for ${purpose} in ${city}, Pakistan`,
        "numberOfItems": properties.length,
        "itemListElement": properties.slice(0, 10).map((property, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": property.title || property.name,
                "url": `http://localhost:5173/property/${property.slug || property._id}`,
                "image": property.thumbnail || property.mainImage
            }
        }))
    };
};

export const generateOrganizationStructuredData = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Zameen",
        "url": "http://localhost:5173",
        "logo": "http://localhost:5173/logo.png",
        "description": "Pakistan's leading property portal for buying, selling, and renting properties",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "PK"
        },
        "sameAs": [
            "https://facebook.com/zameen",
            "https://twitter.com/zameen",
            "https://instagram.com/zameen"
        ]
    };
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": `http://localhost:5173${crumb.path}`
        }))
    };
};

// Generate SEO-friendly title
export const generateTitle = (parts, suffix = 'Zameen') => {
    const filtered = parts.filter(Boolean);
    return filtered.length > 0 ? `${filtered.join(' | ')} - ${suffix}` : suffix;
};

// Generate SEO-friendly description
export const generateDescription = (template, data) => {
    return template.replace(/\{(\w+)\}/g, (match, key) => data[key] || match);
};

// Format number for display
export const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString('en-PK');
};
