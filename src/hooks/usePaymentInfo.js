
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/payment-info';

const fetchPaymentInfo = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const usePaymentInfo = () => {
    return useQuery({
        queryKey: ['payment_info'],
        queryFn: fetchPaymentInfo,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
};
