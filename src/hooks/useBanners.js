
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/banners';
const SELLER_API_URL = '/api/banner-ads';
const PLANS_API_URL = '/api/banner-ads/plans';

// --- API Functions (Admin Managed Banners) ---
export const fetchBanners = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const createBanner = async (bannerData) => {
    // If sending FormData, axios detects it automatically
    const { data } = await axios.post(API_URL, bannerData);
    return data;
};

export const updateBanner = async ({ id, bannerData }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, bannerData);
    return data;
};

export const deleteBanner = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};

// --- API Functions (Seller Banner Requests - Admin View) ---
export const fetchBannerRequests = async () => {
    const { data } = await axios.get(`${SELLER_API_URL}/admin/all`);
    return data;
};

const updateBannerRequestStatus = async ({ id, status }) => {
    const { data } = await axios.put(`${SELLER_API_URL}/admin/${id}/status`, { status });
    return data;
};

export const deleteBannerRequest = async (id) => {
    const { data } = await axios.delete(`${SELLER_API_URL}/admin/delete/${id}`);
    return data;
};

// --- Banner Plans (Admin) ---
export const fetchBannerPlans = async () => {
    const { data } = await axios.get(`${PLANS_API_URL}/admin/all`);
    return data;
};

export const createBannerPlan = async (planData) => {
    const { data } = await axios.post(PLANS_API_URL, planData);
    return data;
};

export const updateBannerPlan = async ({ id, planData }) => {
    const { data } = await axios.put(`${PLANS_API_URL}/${id}`, planData);
    return data;
};

export const deleteBannerPlan = async (id) => {
    const { data } = await axios.delete(`${PLANS_API_URL}/${id}`);
    return data;
};

export const updateSellerBanner = async ({ id, bannerData }) => {
    // This is for admin editing a seller banner
    const { data } = await axios.put(`${SELLER_API_URL}/admin/update/${id}`, bannerData);
    return data;
}

export const fetchPublicBanners = async () => {
    const { data } = await axios.get(`${SELLER_API_URL}/public`);
    return data;
};

// --- Hook ---
export const useBanners = () => {
    const queryClient = useQueryClient();

    // 1. Standard Admin Banners
    const bannersQuery = useQuery({
        queryKey: ['banners'],
        queryFn: fetchBanners,
        staleTime: 5 * 60 * 1000,
    });

    const createBannerMutation = useMutation({
        mutationFn: createBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });

    const updateBannerMutation = useMutation({
        mutationFn: updateBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });

    const deleteBannerMutation = useMutation({
        mutationFn: deleteBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });

    // 2. Seller Banner Requests
    const bannerRequestsQuery = useQuery({
        queryKey: ['admin_banner_requests'],
        queryFn: fetchBannerRequests,
        staleTime: 5 * 60 * 1000,
    });

    const updateRequestStatusMutation = useMutation({
        mutationFn: updateBannerRequestStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_banner_requests'] });
            // If status changes to approved/active, it might appear in public lists, so invalidate those too if needed
            // For now, these are separate lists in admin
        }
    });

    const deleteRequestMutation = useMutation({
        mutationFn: deleteBannerRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_banner_requests'] });
        }
    });

    const updateSellerBannerMutation = useMutation({
        mutationFn: updateSellerBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_banner_requests'] });
        }
    });

    // 2.5 Banner Plans
    const bannerPlansQuery = useQuery({
        queryKey: ['banner_plans_admin'],
        queryFn: fetchBannerPlans,
        staleTime: 60 * 60 * 1000,
    });

    const createPlanMutation = useMutation({
        mutationFn: createBannerPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner_plans_admin'] });
        },
    });

    const updatePlanMutation = useMutation({
        mutationFn: updateBannerPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner_plans_admin'] });
        },
    });

    const deletePlanMutation = useMutation({
        mutationFn: deleteBannerPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banner_plans_admin'] });
        },
    });

    // 3. Public Banners (For front-facing components)
    const publicBannersQuery = useQuery({
        queryKey: ['public_banners'],
        queryFn: fetchPublicBanners,
        staleTime: 10 * 60 * 1000,
    });


    // 4. Combined Banners for Home/Display
    const displayBannersQuery = useQuery({
        queryKey: ['display_banners'],
        queryFn: async () => {
            const [adminData, publicData] = await Promise.all([
                fetchBanners(),
                fetchPublicBanners()
            ]);

            let combined = [];
            if (Array.isArray(adminData)) {
                const admin = adminData.filter(b => b.page === 'home' && b.active);
                combined = [...combined, ...admin];
            }
            if (Array.isArray(publicData)) {
                const sellerBanners = publicData.map(b => ({
                    ...b,
                    image: b.bannerImage,
                    subtitle: b.description,
                    link: b.redirectUrl,
                    buttonText: 'View Details',
                    isSeller: true
                }));
                combined = [...combined, ...sellerBanners];
            }
            return combined;
        },
        staleTime: 10 * 60 * 1000,
    });

    return {
        // Admin Banners
        banners: bannersQuery.data || [],
        isLoadingBanners: bannersQuery.isLoading,
        isErrorBanners: bannersQuery.isError,
        createBanner: createBannerMutation.mutate,
        createBannerAsync: createBannerMutation.mutateAsync,
        updateBanner: updateBannerMutation.mutate,
        updateBannerAsync: updateBannerMutation.mutateAsync,
        deleteBanner: deleteBannerMutation.mutate,
        deleteBannerAsync: deleteBannerMutation.mutateAsync,

        // Banner Requests
        bannerRequests: bannerRequestsQuery.data || [],
        isLoadingRequests: bannerRequestsQuery.isLoading,
        isErrorRequests: bannerRequestsQuery.isError,
        updateRequestStatus: updateRequestStatusMutation.mutate,
        updateRequestStatusAsync: updateRequestStatusMutation.mutateAsync,
        deleteRequest: deleteRequestMutation.mutate,
        deleteRequestAsync: deleteRequestMutation.mutateAsync,
        updateSellerBannerAsync: updateSellerBannerMutation.mutateAsync,

        // Banner Plans
        bannerPlans: bannerPlansQuery.data || [],
        isLoadingPlans: bannerPlansQuery.isLoading,
        createPlan: createPlanMutation.mutateAsync,
        updatePlan: updatePlanMutation.mutateAsync,
        deletePlan: deletePlanMutation.mutateAsync,

        // Public Banners
        publicBanners: publicBannersQuery.data || [],
        isLoadingPublic: publicBannersQuery.isLoading,

        // Display Banners (Combined)
        displayBanners: displayBannersQuery.data || [],
        isLoadingDisplay: displayBannersQuery.isLoading,

        // Global Loading State (optional convenience)
        isLoading: bannersQuery.isLoading || bannerRequestsQuery.isLoading || publicBannersQuery.isLoading || displayBannersQuery.isLoading,
    };
};
