// Image Optimization Utilities
import { API_BASE_URL } from '../config';

/**
 * Create an optimized image URL with caching
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, options = {}) => {
    if (!url) return '';

    const {
        width = null,
        height = null,
        quality = 80,
        format = 'webp'
    } = options;

    // If it's a local server image, add optimization params
    if (url.includes(API_BASE_URL)) {
        const params = new URLSearchParams();
        if (width) params.append('w', width);
        if (height) params.append('h', height);
        params.append('q', quality);
        params.append('f', format);

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${params.toString()}`;
    }

    // For Cloudinary URLs, add transformation parameters
    if (url.includes('cloudinary.com')) {
        const transformations = [];
        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);
        transformations.push(`q_auto`);
        transformations.push(`f_auto`);
        transformations.push('c_fill');

        const transformationString = transformations.join(',');
        
        // Find /upload/ and insert transformations after it
        // Ensure we don't add them if they already exist or if it's not a standard upload URL
        if (url.includes('/upload/') && !url.includes('/upload/w_')) {
            return url.replace('/upload/', `/upload/${transformationString}/`);
        }
    }

    // For external URLs (Unsplash, etc.), use their optimization params
    if (url.includes('unsplash.com')) {
        const params = new URLSearchParams();
        if (width) params.append('w', width);
        if (height) params.append('h', height);
        params.append('q', quality);
        params.append('auto', 'format');

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${params.toString()}`;
    }

    return url;
};

/**
 * Preload an image
 * @param {string} src - Image source URL
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Lazy load images with Intersection Observer
 * @param {HTMLElement} element - Image element to observe
 * @param {Function} callback - Callback when image enters viewport
 */
export const lazyLoadImage = (element, callback) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before entering viewport
    });

    observer.observe(element);
    return observer;
};

/**
 * Get responsive image sizes based on screen width
 * @returns {object} Image size recommendations
 */
export const getResponsiveImageSizes = () => {
    const width = window.innerWidth;

    if (width < 576) {
        return { thumbnail: 300, card: 400, detail: 600 };
    } else if (width < 768) {
        return { thumbnail: 400, card: 500, detail: 800 };
    } else if (width < 1200) {
        return { thumbnail: 500, card: 600, detail: 1000 };
    } else {
        return { thumbnail: 600, card: 800, detail: 1200 };
    }
};

/**
 * Convert image to WebP format (client-side)
 * @param {string} imageUrl - Original image URL
 * @returns {Promise<string>} WebP data URL
 */
export const convertToWebP = async (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert to WebP with 80% quality
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }, 'image/webp', 0.8);
        };

        img.onerror = reject;
        img.src = imageUrl;
    });
};

/**
 * Image cache manager
 */
class ImageCache {
    constructor(maxSize = 50) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    get(key) {
        return this.cache.get(key);
    }

    has(key) {
        return this.cache.has(key);
    }

    clear() {
        this.cache.clear();
    }
}

export const imageCache = new ImageCache(50);
