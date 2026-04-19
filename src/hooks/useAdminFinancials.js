
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// --- Payments ---
const fetchPendingPayments = async ({ token, category }) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: category ? { category } : {}
    };
    const { data } = await axios.get('/api/payments/pending', config);
    return data;
};

const reviewPayment = async ({ token, reviewData }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post('/api/payments/review', reviewData, config);
    return data;
};

// --- Deals ---
const fetchDeals = async () => {
    const { data } = await axios.get('/api/deals?role=admin');
    return data;
};

const createDeal = async (dealData) => {
    const { data } = await axios.post('/api/deals', dealData);
    return data;
};

const updateDeal = async ({ id, dealData }) => {
    const { data } = await axios.put(`/api/deals/${id}`, dealData);
    return data;
};

const deleteDeal = async (id) => {
    const { data } = await axios.delete(`/api/deals/${id}`);
    return data;
};

// --- Subscription Requests ---
const fetchSubscriptionRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_BASE_URL}/api/subscription-requests`, config);
    return data;
};

const reviewSubscription = async ({ token, id, action }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`${API_BASE_URL}/api/subscription-requests/${id}/status`, { status: action }, config);
    return data;
};

const deleteSubscriptionRequest = async ({ token, id }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`${API_BASE_URL}/api/subscription-requests/${id}`, config);
    return data;
};

// --- Ads (AdRequests & AdDeals) ---
const fetchAdRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get('/api/ads/admin/requests', config);
    return data;
};

const reviewAdRequest = async ({ token, id, status, reviewData }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // Review data optional? Endpoint uses put with { status } or maybe more?
    // AdminAdRequests.jsx uses: await axios.put(url, { status }, config);
    // There is no complex review data shown in AdminAdRequests.jsx, just status.
    const { data } = await axios.put(`/api/ads/admin/requests/${id}/status`, { status, ...reviewData }, config);
    return data;
};

const deleteAdRequest = async ({ token, id }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`/api/ads/admin/requests/${id}`, config);
    return data;
};

const fetchAdDeals = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get('/api/ads/admin/deals', config);
    return data;
};

const createAdDeal = async ({ token, dealData }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post('/api/ads/deals', dealData, config);
    return data;
};

const updateAdDeal = async ({ token, id, dealData }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`/api/ads/deals/${id}`, dealData, config);
    return data;
};

const deleteAdDeal = async ({ token, id }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`/api/ads/deals/${id}`, config);
    return data;
};

export const useAdminAdRequests = (token) => {
    const queryClient = useQueryClient();

    const requestsQuery = useQuery({
        queryKey: ['admin_ad_requests'],
        queryFn: () => fetchAdRequests(token),
        enabled: !!token,
    });

    const reviewMutation = useMutation({
        mutationFn: reviewAdRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_ad_requests'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAdRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_ad_requests'] }),
    });

    return {
        requests: requestsQuery.data || [],
        isLoading: requestsQuery.isLoading,
        reviewAdRequest: reviewMutation.mutateAsync,
        deleteAdRequest: deleteMutation.mutateAsync,
    };
};

export const useAdminAdDeals = (token) => {
    const queryClient = useQueryClient();

    const dealsQuery = useQuery({
        queryKey: ['admin_ad_deals'],
        queryFn: () => fetchAdDeals(token),
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: createAdDeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_ad_deals'] }),
    });

    const updateMutation = useMutation({
        mutationFn: updateAdDeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_ad_deals'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAdDeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_ad_deals'] }),
    });

    return {
        deals: dealsQuery.data || [],
        isLoading: dealsQuery.isLoading,
        createAdDeal: createMutation.mutateAsync,
        updateAdDeal: updateMutation.mutateAsync,
        deleteAdDeal: deleteMutation.mutateAsync,
    };
};

export const usePendingPayments = (token, category) => {
    return useQuery({
        queryKey: ['pending_payments', category],
        queryFn: () => fetchPendingPayments({ token, category }),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};

export const useReviewPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reviewPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending_payments'] });
        },
    });
};

export const useAdminDeals = () => {
    const queryClient = useQueryClient();

    const dealsQuery = useQuery({
        queryKey: ['admin_deals'],
        queryFn: fetchDeals,
        staleTime: 10 * 60 * 1000,
    });

    const createDealMutation = useMutation({
        mutationFn: createDeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_deals'] }),
    });

    const updateDealMutation = useMutation({
        mutationFn: updateDeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_deals'] }),
    });

    const deleteDealMutation = useMutation({
        mutationFn: deleteDeal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_deals'] }),
    });

    return {
        deals: dealsQuery.data || [],
        isLoading: dealsQuery.isLoading,
        createDeal: createDealMutation.mutateAsync,
        updateDeal: updateDealMutation.mutateAsync,
        deleteDeal: deleteDealMutation.mutateAsync,
    };
};

export const useAdminSubscriptionRequests = (token) => {
    const queryClient = useQueryClient();

    const requestsQuery = useQuery({
        queryKey: ['admin_subscription_requests'],
        queryFn: () => fetchSubscriptionRequests(token),
        enabled: !!token,
    });

    const reviewMutation = useMutation({
        mutationFn: reviewSubscription,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_subscription_requests'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSubscriptionRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_subscription_requests'] }),
    });

    return {
        requests: requestsQuery.data || [],
        isLoading: requestsQuery.isLoading,
        reviewSubscription: reviewMutation.mutateAsync,
        deleteSubscription: deleteMutation.mutateAsync,
    };
};

// --- Payment Info (Bank Details for UI) ---
const fetchPaymentInfo = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/payment-info`);
    return data;
};

const createPaymentInfo = async (text) => {
    const { data } = await axios.post(`${API_BASE_URL}/api/payment-info`, { text });
    return data;
};

const updatePaymentInfo = async ({ id, text }) => {
    const { data } = await axios.put(`${API_BASE_URL}/api/payment-info/${id}`, { text });
    return data;
};

const deletePaymentInfo = async (id) => {
    const { data } = await axios.delete(`${API_BASE_URL}/api/payment-info/${id}`);
    return data;
};

export const usePaymentInfo = () => {
    const queryClient = useQueryClient();

    const infoQuery = useQuery({
        queryKey: ['payment_info'],
        queryFn: fetchPaymentInfo,
        staleTime: 10 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: createPaymentInfo,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment_info'] }),
    });

    const updateMutation = useMutation({
        mutationFn: updatePaymentInfo,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment_info'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePaymentInfo,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment_info'] }),
    });

    return {
        info: infoQuery.data || [],
        isLoading: infoQuery.isLoading,
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
    };
};

// --- Approved Subscriptions ---
const fetchApprovedSubscriptions = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_BASE_URL}/api/subscription-requests?status=approved`, config);
    return data;
};

export const useApprovedSubscriptions = (token) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['approved_subscriptions'],
        queryFn: () => fetchApprovedSubscriptions(token),
        enabled: !!token,
    });

    // Reusing reviewSubscription from main hook logic if needed, 
    // but usually this page might revert to pending or delete.
    // We can expose a dedicated mutation here or reuse useAdminSubscriptionRequests logic if centralized.
    // For simplicity, let's allow "revert to pending" (update status) and "delete".

    // Reuse existing reviewSubscription function from closure or redefine
    const updateStatus = async ({ id, status }) => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`${API_BASE_URL}/api/subscription-requests/${id}/status`, { status }, config);
    };

    const deleteSub = async (id) => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${API_BASE_URL}/api/subscription-requests/${id}`, config);
    };

    const updateStatusMutation = useMutation({
        mutationFn: updateStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['approved_subscriptions'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSub,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['approved_subscriptions'] }),
    });

    return {
        subscriptions: query.data || [],
        isLoading: query.isLoading,
        revertToPending: (id) => updateStatusMutation.mutateAsync({ id, status: 'pending' }),
        deleteSubscription: deleteMutation.mutateAsync,
    };
};

// --- Payment Prices (Admin Management) ---
const fetchPaymentPrices = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/payment-prices`);
    return data;
};

const createPaymentPrice = async ({ token, data }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data: res } = await axios.post(`${API_BASE_URL}/api/payment-prices`, data, config);
    return res;
};

const updatePaymentPrice = async ({ token, id, data }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data: res } = await axios.put(`${API_BASE_URL}/api/payment-prices/${id}`, data, config);
    return res;
};

const deletePaymentPrice = async ({ token, id }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`${API_BASE_URL}/api/payment-prices/${id}`, config);
    return data;
};

export const useAdminPaymentPrices = (token) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['admin_payment_prices'],
        queryFn: fetchPaymentPrices,
        staleTime: 5 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: createPaymentPrice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_payment_prices'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updatePaymentPrice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_payment_prices'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deletePaymentPrice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_payment_prices'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });

    return {
        prices: query.data || [],
        isLoading: query.isLoading,
        createPrice: createMutation.mutateAsync,
        updatePrice: updateMutation.mutateAsync,
        deletePrice: deleteMutation.mutateAsync,
    };
};
// --- Agency Plans Management ---
const fetchAgencyPlans = async () => {
    const { data } = await axios.get('/api/agencies/plans/all');
    return data;
};

const createAgencyPlan = async (planData) => {
    const { data } = await axios.post('/api/agencies/plans', planData);
    return data;
};

const updateAgencyPlan = async ({ id, planData }) => {
    const { data } = await axios.put(`/api/agencies/plans/${id}`, planData);
    return data;
};

const deleteAgencyPlan = async (id) => {
    const { data } = await axios.delete(`/api/agencies/plans/${id}`);
    return data;
};

// --- Project Plans Management ---
const fetchProjectPlans = async () => {
    const { data } = await axios.get('/api/project-plans/all');
    return data;
};

const createProjectPlan = async (planData) => {
    const { data } = await axios.post('/api/project-plans', planData);
    return data;
};

const updateProjectPlan = async ({ id, planData }) => {
    const { data } = await axios.put(`/api/project-plans/${id}`, planData);
    return data;
};

const deleteProjectPlan = async (id) => {
    const { data } = await axios.delete(`/api/project-plans/${id}`);
    return data;
};

export const useAgencyPlans = () => {
    const queryClient = useQueryClient();

    const plansQuery = useQuery({
        queryKey: ['agency_plans'],
        queryFn: fetchAgencyPlans,
        staleTime: 10 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: createAgencyPlan,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agency_plans'] }),
    });

    const updateMutation = useMutation({
        mutationFn: updateAgencyPlan,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agency_plans'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAgencyPlan,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agency_plans'] }),
    });

    return {
        plans: plansQuery.data || [],
        isLoading: plansQuery.isLoading,
        createPlan: createMutation.mutateAsync,
        updatePlan: updateMutation.mutateAsync,
        deletePlan: deleteMutation.mutateAsync,
    };
};

export const useProjectPlans = () => {
    const queryClient = useQueryClient();

    const plansQuery = useQuery({
        queryKey: ['project_plans'],
        queryFn: fetchProjectPlans,
        staleTime: 10 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: createProjectPlan,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_plans'] }),
    });

    const updateMutation = useMutation({
        mutationFn: updateProjectPlan,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_plans'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProjectPlan,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project_plans'] }),
    });

    return {
        plans: plansQuery.data || [],
        isLoading: plansQuery.isLoading,
        createPlan: createMutation.mutateAsync,
        updatePlan: updateMutation.mutateAsync,
        deletePlan: deleteMutation.mutateAsync,
    };
};
