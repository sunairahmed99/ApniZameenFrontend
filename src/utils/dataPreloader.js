// Data Preloader - Preload critical data when app loads using React Query
import { queryClient } from '../app/queryClient';
import { fetchProperties } from '../hooks/useProperties';
import { fetchAgencies } from '../hooks/useAgencies';
import { fetchProjects } from '../hooks/useProjects';
import { fetchPublicBanners } from '../hooks/useBanners';

/**
 * Preload critical data for the application
 * This runs when the app first loads to cache important data in React Query
 */
export const preloadCriticalData = async () => {
    // Only log in development
    if (import.meta.env.DEV) {
        
    }

    const preloadTasks = [];

    // 1. Preload Featured Properties (Homepage)
    preloadTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['properties', { featured: 'true', limit: 6 }],
            queryFn: () => fetchProperties({ featured: 'true', limit: 6 }),
            staleTime: 10 * 60 * 1000,
        })
    );

    // 2. Preload Titanium Agencies
    preloadTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['agencies_list', { tier: 'titanium', limit: 10 }],
            queryFn: () => fetchAgencies({ tier: 'titanium', limit: 10 }),
            staleTime: 15 * 60 * 1000,
        })
    );

    // 3. Preload Featured Agencies
    preloadTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['agencies_list', { featured: 'true', limit: 10 }],
            queryFn: () => fetchAgencies({ featured: 'true', limit: 10 }),
            staleTime: 15 * 60 * 1000,
        })
    );

    // 4. Preload New Projects
    preloadTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['projects_list', { status: 'active', limit: 12 }],
            queryFn: () => fetchProjects({ status: 'active', limit: 12 }),
            staleTime: 10 * 60 * 1000,
        })
    );

    // 6. Preload Karachi Properties (most common search)
    preloadTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['properties', { city: 'Karachi', purpose: 'For Sale', limit: 10 }],
            queryFn: () => fetchProperties({ city: 'Karachi', purpose: 'For Sale', limit: 10 }),
            staleTime: 5 * 60 * 1000,
        })
    );

    // 7. Preload Banner Ads
    preloadTasks.push(
        queryClient.prefetchQuery({
            queryKey: ['public_banners'],
            queryFn: fetchPublicBanners,
            staleTime: 30 * 60 * 1000,
        })
    );

    // Execute all preload tasks in parallel
    try {
        await Promise.allSettled(preloadTasks);
        if (import.meta.env.DEV) {
            
        }
    } catch (error) {
        
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
