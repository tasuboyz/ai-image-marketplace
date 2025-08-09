import api from './api';

export interface GalleryImage {
  id: string;
  filename: string;
  path: string;
  category: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  extension: string;
}

export interface Category {
  name: string;
  slug: string;
  imageCount: number;
  path: string;
}

export interface GalleryResponse {
  message: string;
  count: number;
  images: GalleryImage[];
}

export interface CategoriesResponse {
  message: string;
  count: number;
  categories: Category[];
}

/**
 * Service for handling gallery operations
 */
class GalleryService {
  /**
   * Get all images from the gallery
   */
  async getAllImages(): Promise<GalleryResponse> {
    try {
      const response = await api.get('/gallery');
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw new Error('Failed to fetch gallery images');
    }
  }

  /**
   * Get images by category
   */
  async getImagesByCategory(category: string): Promise<GalleryResponse> {
    try {
      const response = await api.get(`/gallery/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for category ${category}:`, error);
      throw new Error(`Failed to fetch images for category ${category}`);
    }
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await api.get('/gallery/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get image URL for display
   */
  getImageUrl(imagePath: string): string {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `/${cleanPath}`;
  }

  /**
   * Get thumbnail URL (for now, same as original)
   */
  getThumbnailUrl(imagePath: string): string {
    return this.getImageUrl(imagePath);
  }

  /**
   * Search images by filename
   */
  searchImages(images: GalleryImage[], searchTerm: string): GalleryImage[] {
    if (!searchTerm) return images;
    
    const term = searchTerm.toLowerCase();
    return images.filter(image => 
      image.filename.toLowerCase().includes(term) ||
      image.category.toLowerCase().includes(term)
    );
  }

  /**
   * Filter images by extension
   */
  filterByExtension(images: GalleryImage[], extension: string): GalleryImage[] {
    if (!extension) return images;
    
    return images.filter(image => 
      image.extension.toLowerCase() === extension.toLowerCase()
    );
  }

  /**
   * Sort images by various criteria
   */
  sortImages(images: GalleryImage[], sortBy: 'name' | 'date' | 'size', order: 'asc' | 'desc' = 'desc'): GalleryImage[] {
    const sorted = [...images].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }
}

// Export singleton instance
const galleryService = new GalleryService();
export default galleryService;
