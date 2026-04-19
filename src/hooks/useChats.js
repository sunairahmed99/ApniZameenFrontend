
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/chats';

const getTokenConfig = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return {};
    const user = JSON.parse(userStr);
    if (!user || !user.token) return {};
    return {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
};

const fetchChats = async (userId) => {
    if (!userId) return [];
    const { data } = await axios.get(`${API_URL}?userId=${userId}`, getTokenConfig());
    return data;
};

const initiateChat = async (payload) => {
    const { data } = await axios.post(`${API_URL}/initiate`, payload, getTokenConfig());
    return data;
};

const fetchMessages = async (chatId) => {
    if (!chatId) return [];
    const { data } = await axios.get(`${API_URL}/${chatId}/messages`, getTokenConfig());
    return data;
};

const fetchAdminId = async () => {
    const { data } = await axios.get(`${API_URL}/admin-id`, getTokenConfig());
    return data;
};

export const useAdminId = () => {
    return useQuery({
        queryKey: ['admin_id'],
        queryFn: fetchAdminId,
        staleTime: 5 * 60 * 1000, 
    });
};

export const useChats = (userId) => {
    return useQuery({
        queryKey: ['chats', userId],
        queryFn: () => fetchChats(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useInitiateChat = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: initiateChat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });
};

const fetchAllChats = async () => {
    const { data } = await axios.get(`${API_URL}/all`, getTokenConfig());
    return data;
};

export const useAllChats = () => {
    return useQuery({
        queryKey: ['all_chats'],
        queryFn: fetchAllChats,
        staleTime: 5 * 60 * 1000,
    });
};

export const useMessages = (chatId) => {
    return useQuery({
        queryKey: ['messages', chatId],
        queryFn: () => fetchMessages(chatId),
        enabled: !!chatId,
        staleTime: 0, // Messages should be fresh
    });
};
