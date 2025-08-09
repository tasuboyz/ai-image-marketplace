import { useState, useEffect } from 'react';
import galleryService, { type GalleryImage, type Category } from '../../services/gallery.service';

interface GalleryProps {
  onImageSelect?: (image: GalleryImage) => void;
}

export default function Gallery({ onImageSelect }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadGalleryData();
  }, []);

  useEffect(() => {
    filterAndSortImages();
  }, [images, selectedCategory, searchTerm, sortBy]);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [imagesResponse, categoriesResponse] = await Promise.all([
        galleryService.getAllImages(),
        galleryService.getCategories()
      ]);

      setImages(imagesResponse.images);
      setCategories(categoriesResponse.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortImages = () => {
    let filtered = [...images];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = galleryService.searchImages(filtered, searchTerm);
    }

    // Sort
    filtered = galleryService.sortImages(filtered, sortBy, 'desc');

    setFilteredImages(filtered);
  };

  const handleImageClick = (image: GalleryImage) => {
    if (onImageSelect) {
      onImageSelect(image);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Gallery</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button 
            onClick={loadGalleryData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Image Gallery</h2>
        <p className="text-gray-600">
          Explore our collection of {images.length} AI-generated images
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories ({images.length})</option>
              {categories.map(category => (
                <option key={category.slug} value={category.name}>
                  {category.name} ({category.imageCount})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="input-field"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing {filteredImages.length} of {images.length} images
        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Gallery */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            : "space-y-4"
        }>
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageClick(image)}
              className={
                viewMode === 'grid'
                  ? "image-card aspect-square cursor-pointer group"
                  : "bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
              }
            >
              {viewMode === 'grid' ? (
                <>
                  <img
                    src={galleryService.getImageUrl(image.path)}
                    alt={image.filename}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white font-medium text-sm truncate">{image.filename}</p>
                    <p className="text-gray-300 text-xs">{image.category}</p>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={galleryService.getImageUrl(image.path)}
                    alt={image.filename}
                    className="w-16 h-16 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{image.filename}</h3>
                    <p className="text-sm text-gray-600">{image.category}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{galleryService.formatFileSize(image.size)}</span>
                      <span>{galleryService.formatDate(image.createdAt)}</span>
                      <span className="uppercase">{image.extension}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
