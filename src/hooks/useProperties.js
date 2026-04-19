
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/properties';

const fetchPropertyTypes = async () => {
    const { data } = await axios.get(`${API_URL}/types`);
    return data;
};

export const usePropertyTypes = () => {
    return useQuery({
        queryKey: ['property_types'],
        queryFn: fetchPropertyTypes,
        staleTime: 60 * 60 * 1000, // 1 hour cache
    });
};

// Reusing the logic from api.js but with axios and cleaner structure
export const fetchProperties = async (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'string') {
                searchParams.append(key, value.replace(/,/g, ''));
            } else {
                searchParams.append(key, value);
            }
        }
    });

    const { data } = await axios.get(`${API_URL}?${searchParams.toString()}`);
    return data;
};

export const fetchPropertyDetail = async (idOrSlug) => {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    let url = isId ? `${API_URL}/${idOrSlug}` : `${API_URL}/slug/${idOrSlug}`;

    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        // Fallback logic if needed, or just throw
        if (!isId && error.response?.status === 404) {
            // Try seeking as ID if slug failed? Unlikely but kept for compatibility if needed.
            // For now standard behavior.
        }
        throw error;
    }
}


// --- Seller / Protected Operations ---
const fetchSellerProperties = async ({ token, params }) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    });

    const { data } = await axios.get(`${API_URL}/seller/list?${searchParams.toString()}`, config);
    return data;
};

const deleteProperty = async ({ id, token }) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.delete(`${API_URL}/${id}`, config);
    return data;
}

const updatePropertyStatus = async ({ id, status, token }) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.patch(`${API_URL}/seller/${id}/status`, { status }, config);
    return data;
}

// --- Admin Operations ---
const fetchAdminProperties = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    });
    const { data } = await axios.get(`${API_URL}/admin/all?${searchParams.toString()}`);
    return data;
};

const updateAdminProperty = async ({ id, updates }) => {
    const { data } = await axios.put(`${API_URL}/admin/${id}`, updates);
    return data;
};

// --- Hooks ---

export const useAdminProperties = (params) => {
    return useQuery({
        queryKey: ['admin_properties', params],
        queryFn: () => fetchAdminProperties(params),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateAdminProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAdminProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_properties'] });
        },
    });
};

export const useAdminDeleteProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_properties'] });
        },
    });
};

export const useProperties = (filters, options = {}) => {
    return useQuery({
        queryKey: ['properties', filters],
        queryFn: () => fetchProperties(filters),
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};

export const useSellerProperties = (token, params) => {
    return useQuery({
        queryKey: ['seller_properties', params],
        queryFn: () => fetchSellerProperties({ token, params }),
        enabled: !!token,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller_properties'] });
        },
    });
};

export const useUpdatePropertyStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePropertyStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller_properties'] });
        },
    });
};

const updatePropertyContent = async ({ id, formData, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            // NOTE: Do NOT set Content-Type manually for multipart/form-data.
            // Axios will set it automatically with the correct boundary.
        },
    };
    const { data } = await axios.put(`${API_URL}/seller/${id}`, formData, config);
    return data;
};

export const useUpdatePropertyContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePropertyContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller_properties'] });
            queryClient.invalidateQueries({ queryKey: ['property'] });
        },
    });
};


export const useProperty = (idOrSlug) => {
    return useQuery({
        queryKey: ['property', idOrSlug],
        queryFn: () => fetchPropertyDetail(idOrSlug),
        staleTime: 5 * 60 * 1000,
        enabled: !!idOrSlug,
    });
};

const renewProperty = async ({ id, subscriptionId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(`${API_URL}/renew/${id}`, { subscriptionId }, config);
    return data;
};

export const useRenewProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: renewProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller_properties'] });
        },
    });
};

const incrementView = async (id) => {
    const { data } = await axios.post(`${API_URL}/${id}/view`);
    return data;
};

const createLead = async (id) => {
    const { data } = await axios.post(`${API_URL}/${id}/lead`);
    return data;
};

export const useIncrementView = () => {
    return useMutation({
        mutationFn: incrementView,
    });
};

const fetchPropertyCounts = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, typeof value === 'string' ? value.replace(/,/g, '') : value);
        }
    });
    const { data } = await axios.get(`${API_URL}/search-counts?${searchParams.toString()}`);
    return data;
};

export const usePropertyCounts = (params) => {
    return useQuery({
        queryKey: ['property_counts', params],
        queryFn: () => fetchPropertyCounts(params),
        staleTime: 5 * 60 * 1000,
        select: (data) => data || {}
    });
};

const fetchPopularLocations = async () => {
    const { data } = await axios.get(`${API_URL}/counts`);
    return data;
};

export const usePopularLocations = () => {
    return useQuery({
        queryKey: ['popular_locations'],
        queryFn: fetchPopularLocations,
        staleTime: 30 * 60 * 1000,
        select: (data) => Array.isArray(data) ? data : []
    });
};

export const useCategoryCounts = (categories, city) => {
    return useQuery({
        queryKey: ['category_counts', categories, city],
        queryFn: async () => {
            const counts = {};
            const allItems = Object.values(categories).flat();

            // Helper to delay execution
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Process in chunks to avoid 429
            // Reduced to 2 because multiple CategoryCards mount simultaneously (3 cards * 2 = 6 concurrent reqs)
            const chunkSize = 2;
            for (let i = 0; i < allItems.length; i += chunkSize) {
                const chunk = allItems.slice(i, i + chunkSize);

                await Promise.all(chunk.map(async (item) => {
                    try {
                        const params = new URLSearchParams();
                        if (item.query) {
                            if (item.query.propertyType) params.append('type', item.query.propertyType);
                            const effectiveCity = item.query.city || city;
                            if (effectiveCity) params.append('city', effectiveCity);
                            if (item.query.search) params.append('search', item.query.search);
                            if (item.query.area) params.append('search', item.query.area);
                            if (item.query.location) params.append('search', item.query.location);
                        }

                        // Use a lightweight head request or count endpoint if available? 
                        // For now sticking to search but maybe we should optimze backend later.
                        const { data } = await axios.get(`${API_URL}/search?${params.toString()}`);
                        counts[item.title] = Array.isArray(data) ? data.length : 0;
                    } catch (error) {
                        
                        counts[item.title] = 0;
                    }
                }));

                // Random jitter to prevent synchronized bursts from multiple components
                const jitter = Math.floor(Math.random() * 500);
                if (i + chunkSize < allItems.length) {
                    await delay(1000 + jitter);
                }
            }
            return counts;
        },
        enabled: Object.keys(categories).length > 0,
        staleTime: 30 * 60 * 1000, // 30 minutes cache
    });
};

const createProperty = async (propertyData) => {
    const { data } = await axios.post(API_URL, propertyData);
    return data;
};

export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller_properties'] });
        },
    });
};

export const useCreateLead = () => {
    return useMutation({
        mutationFn: createLead,
    });
};
