import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/blogs';

export const fetchBlogs = async (page = 1, pageSize = 9) => {
    const { data } = await axios.get(`${API_URL}?pageNumber=${page}&pageSize=${pageSize}`);
    return data;
};

export const fetchBlogById = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
};

export const fetchBlogBySlug = async (slug) => {
    const { data } = await axios.get(`${API_URL}/slug/${slug}`);
    return data;
};

export const createBlog = async (blogData) => {
    // blogData should be FormData for image upload
    const { data } = await axios.post(API_URL, blogData);
    return data;
};

export const updateBlog = async ({ id, updates }) => {
    // updates should be FormData for image upload
    const { data } = await axios.put(`${API_URL}/${id}`, updates);
    return data;
};

export const deleteBlog = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};

export const useBlogs = (page = 1, pageSize = 9) => {
    return useQuery({
        queryKey: ['blogs', { page, pageSize }],
        queryFn: () => fetchBlogs(page, pageSize),
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true
    });
};

export const useBlog = (idOrSlug) => {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    return useQuery({
        queryKey: ['blog', idOrSlug],
        queryFn: () => isId ? fetchBlogById(idOrSlug) : fetchBlogBySlug(idOrSlug),
        enabled: !!idOrSlug,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['blog'] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};
