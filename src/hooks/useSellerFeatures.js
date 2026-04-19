
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const INQUIRIES_API_URL = '/api/inquiries/seller';

// --- Inquiries ---
const fetchSellerInquiries = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const { data } = await axios.get(INQUIRIES_API_URL, config);
    return data;
};

export const useSellerInquiries = (token) => {
    return useQuery({
        queryKey: ['seller_inquiries'],
        queryFn: () => fetchSellerInquiries(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};

// --- Deals & Packages ---
const fetchDeals = async () => {
    const { data } = await axios.get('/api/deals');
    return data;
};

const submitSubscriptionRequest = async ({ token, formData }) => {
    // formData contains file, so header multipart/form-data is handled by axios automatically when passing FormData
    //  but we need auth token? File said "You must be logged in". Component used axios.post(url, formData). 
    // Wait, component didn't use config with token in axios.post...
    // Line 78: await axios.post(`${API_BASE_URL}/api/subscription-requests`, formData);
    // Be careful, if it needs token, it might have been missing in original code or handled globally?
    // User object check was there. I will look at SellerPackages.jsx line 65, it appends sellerId.
    // So maybe it doesn't need token if sellerId is in body.
    // But AgencyUpgrade.jsx DOES use token.
    const { data } = await axios.post('/api/subscription-requests', formData);
    return data;
};

export const useDeals = () => {
    return useQuery({
        queryKey: ['deals'],
        queryFn: fetchDeals,
        staleTime: 10 * 60 * 1000,
    });
};

const fetchSubscriptionRequests = async (token, sellerId) => {
    const url = sellerId ? `/api/subscription-requests/seller/${sellerId}` : '/api/subscription-requests';
    const { data } = await axios.get(url);
    return data;
};

export const useMySubscriptionRequests = (token, sellerId) => {
    return useQuery({
        queryKey: ['subscription_requests', sellerId],
        queryFn: () => fetchSubscriptionRequests(token, sellerId),
        enabled: !!token,
    });
};

export const useSubmitSubscriptionRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitSubscriptionRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription_requests'] });
        },
    });
};

// --- Agency Upgrades ---
const fetchMyAgencies = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get('/api/agencies/my-agencies', config);
    return data;
};

const submitUpgradeRequest = async ({ token, formData }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post('/api/agencies/upgrade-request', formData, config);
    return data;
};

export const useMyAgencies = (token) => {
    return useQuery({
        queryKey: ['my_agencies'],
        queryFn: () => fetchMyAgencies(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};

export const useSubmitUpgradeRequest = () => {
    return useMutation({
        mutationFn: submitUpgradeRequest,
    });
};

// --- Scoreboard ---
const fetchSellerScoreboard = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_BASE_URL}/api/properties/scoreboard`, config);
    return data;
};

export const useSellerScoreboard = (token) => {
    return useQuery({
        queryKey: ['seller_scoreboard'],
        queryFn: () => fetchSellerScoreboard(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });
};

// --- Advertisement (Property Ads) ---
const fetchSellerAdDeals = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/ads/deals`);
    return data;
};

const fetchSellerAdRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_BASE_URL}/api/ads/my-requests`, config);
    return data;
};

const submitAdRequest = async ({ token, data }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data: res } = await axios.post(`${API_BASE_URL}/api/ads/request`, data, config);
    return res;
};

export const useSellerAdDeals = () => {
    return useQuery({
        queryKey: ['seller_ad_deals'],
        queryFn: fetchSellerAdDeals,
        staleTime: 10 * 60 * 1000,
    });
};

export const useSellerAdRequests = (token) => {
    return useQuery({
        queryKey: ['seller_ad_requests'],
        queryFn: () => fetchSellerAdRequests(token),
        enabled: !!token,
    });
};

export const useSubmitAdRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitAdRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller_ad_requests'] }),
    });
};

// --- Banner Ads ---
const fetchBannerPlans = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/banner-ads/plans`);
    return data;
};

export const useBannerPlans = () => {
    return useQuery({
        queryKey: ['banner_plans'],
        queryFn: fetchBannerPlans,
        staleTime: 60 * 60 * 1000,
    });
};

const fetchBannerRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_BASE_URL}/api/banner-ads/my-requests`, config);
    return data;
};

const submitBannerRequest = async ({ token, data }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data: res } = await axios.post(`${API_BASE_URL}/api/banner-ads/request`, data, config);
    return res;
};

const updateBannerRequest = async ({ token, id, data }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data: res } = await axios.put(`${API_BASE_URL}/api/banner-ads/request/${id}`, data, config);
    return res;
};

const deleteBannerRequest = async ({ token, id }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`${API_BASE_URL}/api/banner-ads/request/${id}`, config);
    return data;
};

export const useBannerRequests = (token) => {
    return useQuery({
        queryKey: ['banner_requests'],
        queryFn: () => fetchBannerRequests(token),
        enabled: !!token,
    });
};

export const useBannerMutations = () => {
    const queryClient = useQueryClient();

    const submit = useMutation({
        mutationFn: submitBannerRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banner_requests'] }),
    });

    const update = useMutation({
        mutationFn: updateBannerRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banner_requests'] }),
    });

    const remove = useMutation({
        mutationFn: deleteBannerRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banner_requests'] }),
    });

    return { submit, update, remove };
};
