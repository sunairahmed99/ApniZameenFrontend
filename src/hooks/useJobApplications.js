import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/job-applications`;

// Fetch all applications (Admin)
export const useJobApplications = () => {
    return useQuery({
        queryKey: ['job-applications'],
        queryFn: async () => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(API_URL, config);
            return data;
        }
    });
};

// Submit application
export const useApplyForJob = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const { data } = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        }
    });
};

// Update application status
export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }) => {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.put(`${API_URL}/${id}`, { status }, config);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['job-applications']);
        }
    });
};
