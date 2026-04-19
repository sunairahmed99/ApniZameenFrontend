
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/homepage-boxes';

// --- API Functions ---
const fetchBoxes = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

const createBox = async (boxData) => {
  const { data } = await axios.post(API_URL, boxData);
  return data;
};

const updateBox = async ({ id, boxData }) => {
  const { data } = await axios.put(`${API_URL}/${id}`, boxData);
  return data;
};

const deleteBox = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

const fetchDynamicBoxes = async (city) => {
  const { data } = await axios.get(`/api/properties/dynamic-boxes?city=${city || 'Karachi'}`);
  return data;
};

// --- Hook ---
export const useDynamicBoxes = (city) => {
  return useQuery({
    queryKey: ['dynamic_boxes', city],
    queryFn: () => fetchDynamicBoxes(city),
    staleTime: 5 * 60 * 1000,
  });
};

export const useHomePageBoxes = () => {
  const queryClient = useQueryClient();

  const boxesQuery = useQuery({
    queryKey: ['homePageBoxes'],
    queryFn: fetchBoxes,
    staleTime: 5 * 60 * 1000,
  });

  const createBoxMutation = useMutation({
    mutationFn: createBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageBoxes'] });
    },
  });

  const updateBoxMutation = useMutation({
    mutationFn: updateBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageBoxes'] });
    },
  });

  const deleteBoxMutation = useMutation({
    mutationFn: deleteBox,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageBoxes'] });
    },
  });

  return {
    boxes: boxesQuery.data || [],
    isLoading: boxesQuery.isLoading,
    isError: boxesQuery.isError,
    error: boxesQuery.error,
    createBox: createBoxMutation.mutate,
    createBoxAsync: createBoxMutation.mutateAsync,
    updateBox: updateBoxMutation.mutate,
    updateBoxAsync: updateBoxMutation.mutateAsync,
    deleteBox: deleteBoxMutation.mutate,
    deleteBoxAsync: deleteBoxMutation.mutateAsync,
    isCreating: createBoxMutation.isPending,
    isUpdating: updateBoxMutation.isPending,
    isDeleting: deleteBoxMutation.isPending,
  };
};
