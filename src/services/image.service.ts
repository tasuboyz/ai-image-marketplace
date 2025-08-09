import api from './api';
import type { 
  Image, 
  ImagesResponse, 
  ImageFilters, 
  ImageUploadData, 
  ImageUpdateData 
} from '../types/Image';

export const imageService = {
  // Get all images with filters
  getImages: async (filters: ImageFilters = {}): Promise<ImagesResponse> => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/images?${params.toString()}`);
    return response.data;
  },

  // Get single image by ID
  getImage: async (id: string): Promise<{ image: Image }> => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },

  // Upload new image
  uploadImage: async (imageFile: File, data: ImageUploadData): Promise<{ message: string; image: Image }> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Append metadata
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update image
  updateImage: async (id: string, data: ImageUpdateData): Promise<{ message: string; image: Image }> => {
    const response = await api.put(`/images/${id}`, data);
    return response.data;
  },

  // Delete image
  deleteImage: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  },

  // Get user's images
  getUserImages: async (userId?: string, page = 1, limit = 12): Promise<ImagesResponse> => {
    const endpoint = userId ? `/images/user/${userId}` : '/images/user/me';
    const response = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get categories
  getCategories: () => [
    'landscape',
    'portrait', 
    'abstract',
    'nature',
    'urban',
    'fantasy',
    'scifi',
    'art',
    'other'
  ] as const,

  // Get full image URL
  getImageUrl: (url: string): string => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${url}`;
  },
};
