import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// project-requests
const fetchMyProjectRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_BASE_URL}/api/project-requests/my`, config);
    return data;
};

const submitProjectRequest = async ({ token, formData }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(`${API_BASE_URL}/api/project-requests`, formData, config);
    return data;
};

const fetchProjectPlans = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/project-plans`);
    return data;
};

export const useProjectPlans = () => {
    return useQuery({
        queryKey: ['project_plans'],
        queryFn: fetchProjectPlans,
        staleTime: 60 * 60 * 1000,
    });
};

export const useMyProjectRequests = (token) => {
    return useQuery({
        queryKey: ['my_project_requests'],
        queryFn: () => fetchMyProjectRequests(token),
        enabled: !!token,
    });
};

export const useSubmitProjectRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitProjectRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_project_requests'] });
        },
    });
};
