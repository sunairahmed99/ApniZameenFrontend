import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/settings';

const fetchSettings = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const useSiteSettings = () => {
    return useQuery({
        queryKey: ['siteSettings'],
        queryFn: fetchSettings,
        staleTime: 60 * 60 * 1000, // 1 hour cache
    });
};

const updateSettings = async ({ token, formData }) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const { data } = await axios.put(API_URL, formData, config);
    return data;
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
        }
    });
};
