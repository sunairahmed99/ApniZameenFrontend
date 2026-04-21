import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/agencies';

export const fetchAgencies = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    });
    const url = searchParams.toString() ? `${API_URL}?${searchParams.toString()}` : API_URL;
    const { data } = await axios.get(url);
    return data;
};

// ... existing code ...

export const fetchMyAgencies = async (token, params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    });

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const queryString = searchParams.toString();
    const url = queryString ? `${API_URL}/my-agencies?${queryString}` : `${API_URL}/my-agencies`;

    const { data } = await axios.get(url, config);
    return data;
};

export const fetchAgencyPlans = async () => {
    const { data } = await axios.get(`${API_URL}/plans`);
    return data;
};

export const fetchAgencyById = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
};

export const fetchAgencyStats = async () => {
    const { data } = await axios.get(`${API_URL}/stats/by-city`);
    return data;
};

export const createAgency = async ({ agencyData, token }) => {
    const headers = { Authorization: `Bearer ${token}` };
    // Do NOT set Content-Type for FormData — axios sets it with the correct boundary automatically
    if (!(agencyData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const { data } = await axios.post(API_URL, agencyData, { headers });
    return data;
};

export const updateAgency = async ({ id, agencyData, token }) => {
    const headers = { Authorization: `Bearer ${token}` };
    // Do NOT set Content-Type for FormData — axios sets it with the correct boundary automatically
    if (!(agencyData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const { data } = await axios.put(`${API_URL}/${id}`, agencyData, { headers });
    return data;
};

export const deleteAgency = async ({ id, token }) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.delete(`${API_URL}/${id}`, config);
    return data;
};

// --- Hooks ---

export const useMyAgencies = (token, params) => {
    return useQuery({
        queryKey: ['my_agencies', token, params],
        queryFn: () => fetchMyAgencies(token, params),
        enabled: !!token,
        placeholderData: keepPreviousData, // Use placeholderData for v5
        staleTime: 5 * 60 * 1000,
    });
};

export const upgradeAgency = async ({ upgradeData }) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    };
    const { data } = await axios.post(`${API_URL}/upgrade-request`, upgradeData, config);
    return data;
};

export const useUpgradeAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: upgradeAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_agencies'] });
        },
    });
};

export const useAgencyPlans = () => {
    return useQuery({
        queryKey: ['agency_plans'],
        queryFn: fetchAgencyPlans,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
};

export const useAgenciesList = (params) => {
    return useQuery({
        queryKey: ['agencies_list', params],
        queryFn: () => fetchAgencies(params),
        staleTime: 0, // No cache - always fresh data
        refetchOnWindowFocus: true,
    });
};

export const useFeaturedAgencies = (city, limit) => {
    return useQuery({
        queryKey: ['agencies_list', { titanium: true, city, limit }],
        queryFn: () => fetchAgencies({ titanium: true, city, limit }),
        staleTime: 15 * 60 * 1000,
    });
};

export const useAgencyStats = () => {
    return useQuery({
        queryKey: ['agency_stats_by_city'],
        queryFn: fetchAgencyStats,
        staleTime: 60 * 60 * 1000,
    });
};

export const useAgency = (id) => {
    return useQuery({
        queryKey: ['agency', id],
        queryFn: () => fetchAgencyById(id),
        staleTime: 10 * 60 * 1000,
        enabled: !!id,
    });
};

export const useCreateAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_agencies'] });
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};

export const useUpdateAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_agencies'] });
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};

export const fetchUpgradeRequests = async () => {
    const { data } = await axios.get(`${API_URL}/upgrade-requests`);
    return data;
};

export const approveUpgradeRequest = async (id) => {
    const { data } = await axios.put(`${API_URL}/upgrade-requests/${id}/approve`);
    return data;
};

export const rejectUpgradeRequest = async (id) => {
    const { data } = await axios.put(`${API_URL}/upgrade-requests/${id}/reject`);
    return data;
};

export const useAdminUpgradeRequests = () => {
    return useQuery({
        queryKey: ['admin_upgrade_requests'],
        queryFn: fetchUpgradeRequests,
    });
};

export const useApproveUpgradeRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveUpgradeRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_upgrade_requests'] });
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};

export const useRejectUpgradeRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectUpgradeRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_upgrade_requests'] });
        },
    });
};

export const useDeleteAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_agencies'] });
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};

// Approve/Reject Agency API functions
export const approveAgency = async ({ id, token }) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await axios.put(`${API_URL}/${id}/approve`, {}, config);
    return data;
};

export const rejectAgency = async ({ id, token }) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await axios.put(`${API_URL}/${id}/reject`, {}, config);
    return data;
};

export const deactivateAgency = async ({ id, token }) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    try {
        const { data } = await axios.put(`${API_URL}/${id}/deactivate`, {}, config);
        
        return data;
    } catch (error) {
        
        throw error;
    }
};

// Approve/Reject Agency Hooks
export const useApproveAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};

export const useRejectAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};

export const useDeactivateAgency = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deactivateAgency,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies_list'] });
        },
    });
};
