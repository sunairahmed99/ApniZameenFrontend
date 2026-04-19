import axios from 'axios';
import { API_BASE_URL as BASE } from '../config';

const API_BASE_URL = `${BASE}/api/analytics`;

/**
 * Log an analytics event to the backend.
 * @param {string} eventType - 'visit', 'search', 'contact_click', 'property_view'
 * @param {object} details - Additional data for the event
 */
export const logEvent = async (eventType, details = {}) => {
    try {
        const token = localStorage.getItem('token');
        const config = token ? {
            headers: { Authorization: `Bearer ${token}` }
        } : {};

        await axios.post(`${API_BASE_URL}/log`, {
            eventType,
            details
        }, config);
    } catch (error) {
        // Silently fail analytics logging to not disrupt user experience
        
    }
};

/**
 * Tracks a page visit once per session.
 */
export const trackSessionVisit = () => {
    const hasVisited = sessionStorage.getItem('site_visited');
    if (!hasVisited) {
        logEvent('visit', { page: window.location.pathname });
        sessionStorage.setItem('site_visited', 'true');
    }
};
