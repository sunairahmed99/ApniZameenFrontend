import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const AGENCIES_API_URL = '/api/agencies';
const BROWSE_API_URL = '/api/browse-sections';

const fetchAgencies = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && value !== 'All') {
            searchParams.append(key, value);
        }
    });

    const { data } = await axios.get(`${AGENCIES_API_URL}?${searchParams.toString()}`);
    return data;
};

export const useAgenciesList = (filters) => {
    return useQuery({
        queryKey: ['agencies_list', filters],
        queryFn: () => fetchAgencies(filters),
        staleTime: 10 * 60 * 1000,
    });
};

// --- Browse Sections ---
const fetchBrowseSections = async () => {
    const { data } = await axios.get(BROWSE_API_URL);
    return data;
};

const createBrowseSection = async (sectionData) => {
    const { data } = await axios.post(BROWSE_API_URL, sectionData);
    return data;
};

const updateBrowseSection = async ({ id, sectionData }) => {
    const { data } = await axios.put(`${BROWSE_API_URL}/${id}`, sectionData);
    return data;
};

const deleteBrowseSection = async (id) => {
    const { data } = await axios.delete(`${BROWSE_API_URL}/${id}`);
    return data;
};

export const useBrowseSections = () => {
    const queryClient = useQueryClient();

    const sectionsQuery = useQuery({
        queryKey: ['browse_sections'],
        queryFn: fetchBrowseSections,
        staleTime: 30 * 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: createBrowseSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['browse_sections'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateBrowseSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['browse_sections'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBrowseSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['browse_sections'] });
        },
    });

    return {
        sections: sectionsQuery.data || [],
        isLoading: sectionsQuery.isLoading,
        createSection: createMutation.mutateAsync,
        updateSection: updateMutation.mutateAsync,
        deleteSection: deleteMutation.mutateAsync,
    };
};
