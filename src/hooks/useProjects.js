
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/projects';
const INQUIRY_API_URL = '/api/inquiries';

export const fetchProjectById = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
};

export const fetchProjectDetail = async (slug) => {
    const { data } = await axios.get(`${API_URL}/slug/${slug}`);
    return data;
};

export const fetchProjects = async (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    });
    const url = searchParams.toString() ? `${API_URL}?${searchParams.toString()}` : API_URL;
    const { data } = await axios.get(url);
    return data;
};

export const deleteProject = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};

export const createProject = async (projectData) => {
    const { data } = await axios.post(API_URL, projectData);
    return data;
};

export const updateProject = async ({ id, updates }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, updates);
    return data;
};

export const useProjectsList = (params) => {
    return useQuery({
        queryKey: ['projects_list', params],
        queryFn: () => fetchProjects(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects_list'] });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects_list'] });
            queryClient.invalidateQueries({ queryKey: ['project'] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects_list'] });
        },
    });
};

export const useProject = (idOrSlug) => {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

    return useQuery({
        queryKey: ['project', idOrSlug],
        queryFn: () => isId ? fetchProjectById(idOrSlug) : fetchProjectDetail(idOrSlug),
        staleTime: 10 * 60 * 1000,
        enabled: !!idOrSlug,
        retry: 1,
    });
};

export const submitInquiry = async (payload) => {
    const { data } = await axios.post(INQUIRY_API_URL, payload);
    return data;
};

export const useProjectInquiry = () => {
    return useMutation({
        mutationFn: submitInquiry,
    });
};
