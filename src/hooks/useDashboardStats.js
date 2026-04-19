
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/admin/stats';

const fetchAdminStats = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const { data } = await axios.get(API_URL, config);

    // Data normalization (moved from component)
    if (!data.charts) data.charts = { typeDistribution: [], growthData: [] };
    if (!data.revenue) data.revenue = { Banner: 0, Agency: 0, Property: 0 };
    if (!data.revenueRadarData) data.revenueRadarData = [];

    return data;
};

const fetchSellerStats = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const { data } = await axios.get('/api/properties/seller/stats', config);
    return data;
};

export const useDashboardStats = (token) => {
    return useQuery({
        queryKey: ['admin_stats'],
        queryFn: () => fetchAdminStats(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};

export const useSellerDashboardStats = (token) => {
    return useQuery({
        queryKey: ['seller_stats'],
        queryFn: () => fetchSellerStats(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};
