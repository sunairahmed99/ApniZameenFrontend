// Data Preloader - Preload ONLY the most critical data at startup
// Heavy data (properties, agencies, projects) is fetched on-demand by React Query
// when components become visible via LazySection — no need to pre-fetch them all.
import { queryClient } from '../app/queryClient';
import { fetchPublicBanners } from '../hooks/useBanners';

/**
 * Preload ONLY the banner ads at startup (needed for LCP banner image).
 * Everything else is lazily fetched by LazySection + React Query hooks.
 */
export const preloadCriticalData = async () => {
    try {
        // Only banners are truly critical at startup (they appear above the fold)
        await queryClient.prefetchQuery({
            queryKey: ['public_banners'],
            queryFn: fetchPublicBanners,
            staleTime: 30 * 60 * 1000,
        });
    } catch (_) {
        // Non-fatal — page will still load from fresh fetch
    }
};

/**
 * Preload data for a specific city
 * @param {string} city - City name
 */
export const preloadCityData = async (city) => {
    if (!city) return;

    if (import.meta.env.DEV) {
        
    }

    const cityTasks = [];

    // Properties for sale
    cityTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['properties', { city, purpose: 'For Sale', limit: 10 }],
            queryFn: () => fetchProperties({ city, purpose: 'For Sale', limit: 10 }),
        })
    );

    // Properties for rent
    cityTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['properties', { city, purpose: 'For Rent', limit: 10 }],
            queryFn: () => fetchProperties({ city, purpose: 'For Rent', limit: 10 }),
        })
    );

    await Promise.allSettled(cityTasks);

    if (import.meta.env.DEV) {
        
    }
};

/**
 * Preload images for faster display
 * @param {Array} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
    if (!Array.isArray(imageUrls)) return;

    imageUrls.forEach(url => {
        if (!url) return;
        const img = new Image();
        img.src = url;
    });
};
