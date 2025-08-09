import type { User } from './User';

export interface ImageMetadata {
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  colorSpace: string;
}

export interface Image {
  _id: string;
  title: string;
  description: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  category: ImageCategory;
  tags: string[];
  aiModel: string;
  prompt: string;
  uploadedBy: User | string;
  likes: number;
  downloads: number;
  views: number;
  isPublic: boolean;
  metadata: ImageMetadata;
  createdAt: string;
  updatedAt: string;
}

export type ImageCategory = 
  | 'landscape' 
  | 'portrait' 
  | 'abstract' 
  | 'nature' 
  | 'urban' 
  | 'fantasy' 
  | 'scifi' 
  | 'art' 
  | 'other';

export interface ImageUploadData {
  title: string;
  description?: string;
  category: ImageCategory;
  tags: string[];
  aiModel?: string;
  prompt?: string;
  isPublic: boolean;
}

export interface ImageUpdateData {
  title?: string;
  description?: string;
  category?: ImageCategory;
  tags?: string[];
  aiModel?: string;
  prompt?: string;
  isPublic?: boolean;
}

export interface ImageFilters {
  category?: ImageCategory;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface ImagePagination {
  currentPage: number;
  totalPages: number;
  totalImages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ImagesResponse {
  images: Image[];
  pagination: ImagePagination;
}
