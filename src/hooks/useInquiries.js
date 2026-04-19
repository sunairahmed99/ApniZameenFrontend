
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/inquiries';

const fetchInquiries = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

const createInquiry = async (payload) => {
    const { data } = await axios.post(API_URL, payload);
    return data;
};

export const useInquiries = () => {
    return useQuery({
        queryKey: ['inquiries'],
        queryFn: fetchInquiries,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateInquiry = () => {
    return useMutation({
        mutationFn: createInquiry,
    });
};
