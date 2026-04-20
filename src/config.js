const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const API_BASE_URL = isLocal ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL || window.location.origin);
