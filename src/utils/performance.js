// Data Caching and Performance Utilities

/**
 * Cache manager for API responses
 */
class DataCache {
    constructor(ttl = 5 * 60 * 1000) { // Default 5 minutes TTL
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Check if expired
        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    has(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;

        // Check if expired
        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    clear() {
        this.cache.clear();
    }

    remove(key) {
        this.cache.delete(key);
    }
}

export const apiCache = new DataCache(5 * 60 * 1000); // 5 minutes

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Create an abortable fetch request
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @returns {object} { promise, abort }
 */
export const abortableFetch = (url, options = {}) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const promise = fetch(url, { ...options, signal });

    return {
        promise,
        abort: () => controller.abort()
    };
};

/**
 * Batch multiple API requests
 * @param {Array} requests - Array of fetch promises
 * @returns {Promise} Promise.allSettled result
 */
export const batchRequests = async (requests) => {
    return Promise.allSettled(requests);
};

/**
 * localStorage wrapper with expiration
 */
export const storage = {
    set: (key, value, ttl = null) => {
        const item = {
            value,
            timestamp: Date.now(),
            ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get: (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);

            // Check expiration
            if (item.ttl && Date.now() - item.timestamp > item.ttl) {
                localStorage.removeItem(key);
                return null;
            }

            return item.value;
        } catch (e) {
            return null;
        }
    },

    remove: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};

/**
 * Memoize expensive function results
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
    const cache = new Map();

    return (...args) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

/**
 * Chunk array for pagination
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * Measure performance of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Performance label
 * @returns {Function} Wrapped function
 */
export const measurePerformance = (fn, label) => {
    return async (...args) => {
        const start = performance.now();
        const result = await fn(...args);
        const end = performance.now();

        // Only log in development
        if (import.meta.env.DEV) {
            
        }

        return result;
    };
};
