import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/jobs';

// Fetch jobs (public or admin)
export const useJobs = (isAdmin = false) => {
    return useQuery({
        queryKey: ['jobs', isAdmin],
        queryFn: async () => {
            // For public view, we might want to filter active only on backend or pass a param
            // But for now, backend returns all if admin, and we can filter on frontend or pass params
            const { data } = await axios.get(`${API_URL}${isAdmin ? '?isAdmin=true' : ''}`);
            return data;
        }
    });
};

// Create Job
export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobData) => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(API_URL, jobData, config);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            alert('Job created successfully');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to create job');
        }
    });
};

// Update Job
export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, jobData }) => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.put(`${API_URL}/${id}`, jobData, config);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            alert('Job updated successfully');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to update job');
        }
    });
};

// Delete Job
export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${API_URL}/${id}`, config);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            alert('Job deleted successfully');
        },
        onError: (error) => {
            alert(error.response?.data?.message || 'Failed to delete job');
        }
    });
};
