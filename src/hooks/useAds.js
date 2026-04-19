
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/ads';

const fetchActiveAds = async () => {
    const { data } = await axios.get(`${API_URL}/active-ads`);
    return data;
};

const fetchAdDeals = async () => {
    const { data } = await axios.get(`${API_URL}/deals`);
    return data;
};

const fetchMyAdRequests = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.get(`${API_URL}/my-requests`, config);
    return data;
};

const createAdRequest = async ({ adData, token }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
    };
    const { data } = await axios.post(`${API_URL}/request`, adData, config);
    return data;
};

export const useActiveAds = () => {
    return useQuery({
        queryKey: ['active_ads'],
        queryFn: fetchActiveAds,
        staleTime: 5 * 60 * 1000,
    });
};

export const useAdDeals = () => {
    return useQuery({
        queryKey: ['ad_deals'],
        queryFn: fetchAdDeals,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
};

export const useSellerAdRequests = (token) => {
    return useQuery({
        queryKey: ['seller_ad_requests', token],
        queryFn: () => fetchMyAdRequests(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateAdRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAdRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller_ad_requests'] });
        },
    });
};
