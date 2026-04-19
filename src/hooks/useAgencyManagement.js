
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const PLANS_API_URL = '/api/agencies/plans';
const REQUESTS_API_URL = '/api/agencies/upgrade-requests';

// --- Plans ---
const fetchPlans = async () => {
    const { data } = await axios.get(`${PLANS_API_URL}/all`);
    return data;
};

const fetchActivePlans = async () => {
    const { data } = await axios.get(PLANS_API_URL);
    return data;
};

const createPlan = async (planData) => {
    // ... existing createPlan
    const { data } = await axios.post(PLANS_API_URL, planData);
    return data;
};

// ... existing updatePlan/deletePlan

// --- Hooks ---

export const useActiveAgencyPlans = () => {
    return useQuery({
        queryKey: ['agency_plans', 'active'],
        queryFn: fetchActivePlans,
        staleTime: 10 * 60 * 1000,
    });
};


const updatePlan = async ({ id, planData }) => {
    const { data } = await axios.put(`${PLANS_API_URL}/${id}`, planData);
    return data;
};

const deletePlan = async (id) => {
    const { data } = await axios.delete(`${PLANS_API_URL}/${id}`);
    return data;
};

// --- Upgrade Requests ---
const fetchUpgradeRequests = async () => {
    const { data } = await axios.get(REQUESTS_API_URL);
    return data;
};

const approveRequest = async (id) => {
    const { data } = await axios.put(`${REQUESTS_API_URL}/${id}/approve`);
    return data;
};

const rejectRequest = async (id) => {
    const { data } = await axios.put(`${REQUESTS_API_URL}/${id}/reject`);
    return data;
};

const deleteRequest = async (id) => {
    const { data } = await axios.delete(`${REQUESTS_API_URL}/${id}`);
    return data;
};

// --- Hooks ---

export const useAgencyPlans = () => {
    const queryClient = useQueryClient();

    const plansQuery = useQuery({
        queryKey: ['agency_plans'],
        queryFn: fetchPlans,
        staleTime: 10 * 60 * 1000,
    });

    const createPlanMutation = useMutation({
        mutationFn: createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency_plans'] });
        },
    });

    const updatePlanMutation = useMutation({
        mutationFn: updatePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency_plans'] });
        },
    });

    const deletePlanMutation = useMutation({
        mutationFn: deletePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency_plans'] });
        },
    });

    return {
        plans: plansQuery.data || [],
        isLoading: plansQuery.isLoading,
        isError: plansQuery.isError,
        error: plansQuery.error,
        createPlan: createPlanMutation.mutateAsync,
        updatePlan: updatePlanMutation.mutateAsync,
        deletePlan: deletePlanMutation.mutateAsync,
    };
};

export const useAgencyUpgradeRequests = () => {
    const queryClient = useQueryClient();

    const requestsQuery = useQuery({
        queryKey: ['agency_upgrade_requests'],
        queryFn: fetchUpgradeRequests,
        staleTime: 5 * 60 * 1000,
    });

    const approveRequestMutation = useMutation({
        mutationFn: approveRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency_upgrade_requests'] });
        },
    });

    const rejectRequestMutation = useMutation({
        mutationFn: rejectRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency_upgrade_requests'] });
        },
    });

    const deleteRequestMutation = useMutation({
        mutationFn: deleteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agency_upgrade_requests'] });
        },
    });

    return {
        requests: requestsQuery.data || [],
        isLoading: requestsQuery.isLoading,
        isError: requestsQuery.isError,
        error: requestsQuery.error,
        approveRequest: approveRequestMutation.mutateAsync,
        rejectRequest: rejectRequestMutation.mutateAsync,
        deleteRequest: deleteRequestMutation.mutateAsync,
    };
};
