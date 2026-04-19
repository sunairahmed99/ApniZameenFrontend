import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/properties/locations';

const fetchLocations = async (params) => {
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

const fetchCityAreas = async (cityName) => {
    if (!cityName) return [];
    // Find city ID first
    const { data: cities } = await axios.get(`${API_URL}?type=city`);
    const cityDoc = cities.find(c => c.name === cityName);

    if (cityDoc) {
        // Fetch areas for this city
        const { data: areas } = await axios.get(`${API_URL}?parentId=${cityDoc._id}&type=area`);
        return areas.map(a => a.name);
    }
    return [];
};

export const useCityAreas = (cityName) => {
    return useQuery({
        queryKey: ['city_areas', cityName],
        queryFn: () => fetchCityAreas(cityName),
        staleTime: 60 * 60 * 1000,
        enabled: !!cityName,
    });
};

const createLocation = async (locationData) => {
    const { data } = await axios.post(API_URL, locationData);
    return data;
};

const deleteLocation = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};

export const useLocations = (params) => {
    return useQuery({
        queryKey: ['locations', params],
        queryFn: () => fetchLocations(params),
        staleTime: 15 * 60 * 1000,
        enabled: !!params,
    });
};

export const useCreateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLocation,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
};

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
};
