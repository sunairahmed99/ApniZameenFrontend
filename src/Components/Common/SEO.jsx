import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Zameen - Property Portal in Pakistan',
    description = 'Find properties for sale and rent in Pakistan. Browse houses, plots, commercial properties, and new projects across major cities.',
    keywords = 'property, real estate, Pakistan, houses, plots, commercial, rent, sale',
    ogImage = '/og-default.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    canonical = null,
}) => {
    const siteUrl = 'https://zameen.com'; // Update with actual domain
    const fullCanonical = canonical || window.location.href;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:site_name" content="Zameen" />

            {/* Twitter */}
            <meta property="twitter:card" content={twitterCard} />
            <meta property="twitter:url" content={fullCanonical} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="author" content="Zameen" />
        </Helmet>
    );
};

export default SEO;
