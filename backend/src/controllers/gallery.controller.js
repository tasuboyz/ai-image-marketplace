import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all images from public/images directory
 */
export const getImages = async (req, res) => {
  try {
    // Path to public/images directory (relative to project root)
    const publicImagesPath = path.join(__dirname, '../../../public/images');
    
    if (!fs.existsSync(publicImagesPath)) {
      return res.status(404).json({
        error: 'Images directory not found'
      });
    }

    const images = [];
    
    // Function to recursively scan directories
    const scanDirectory = (dirPath, relativePath = '') => {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const relativeItemPath = relativePath ? `${relativePath}/${item}` : item;
        
        if (fs.statSync(itemPath).isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(itemPath, relativeItemPath);
        } else {
          // Check if it's an image file
          const ext = path.extname(item).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
            const stats = fs.statSync(itemPath);
            
            images.push({
              id: Buffer.from(relativeItemPath).toString('base64'), // Create unique ID
              filename: item,
              path: `/images/${relativeItemPath.replace(/\\/g, '/')}`, // Ensure forward slashes for web
              category: relativePath || 'Uncategorized',
              size: stats.size,
              createdAt: stats.birthtime,
              modifiedAt: stats.mtime,
              extension: ext.substring(1)
            });
          }
        }
      });
    };

    scanDirectory(publicImagesPath);

    // Sort images by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: 'Images retrieved successfully',
      count: images.length,
      images
    });

  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({
      error: 'Failed to retrieve images',
      details: error.message
    });
  }
};

/**
 * Get images by category
 */
export const getImagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const publicImagesPath = path.join(__dirname, '../../../public/images', category);
    
    if (!fs.existsSync(publicImagesPath)) {
      return res.status(404).json({
        error: `Category '${category}' not found`
      });
    }

    const images = [];
    const items = fs.readdirSync(publicImagesPath);
    
    items.forEach(item => {
      const itemPath = path.join(publicImagesPath, item);
      
      if (fs.statSync(itemPath).isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
          const stats = fs.statSync(itemPath);
          
          images.push({
            id: Buffer.from(`${category}/${item}`).toString('base64'),
            filename: item,
            path: `/images/${category}/${item}`,
            category: category,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            extension: ext.substring(1)
          });
        }
      }
    });

    // Sort images by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: `Images from category '${category}' retrieved successfully`,
      category,
      count: images.length,
      images
    });

  } catch (error) {
    console.error('Error getting images by category:', error);
    res.status(500).json({
      error: 'Failed to retrieve images by category',
      details: error.message
    });
  }
};

/**
 * Get available categories
 */
export const getCategories = async (req, res) => {
  try {
    const publicImagesPath = path.join(__dirname, '../../../public/images');
    
    if (!fs.existsSync(publicImagesPath)) {
      return res.status(404).json({
        error: 'Images directory not found'
      });
    }

    const categories = [];
    const items = fs.readdirSync(publicImagesPath);
    
    items.forEach(item => {
      const itemPath = path.join(publicImagesPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        // Count images in this category
        const categoryPath = path.join(publicImagesPath, item);
        const categoryItems = fs.readdirSync(categoryPath);
        const imageCount = categoryItems.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        }).length;

        categories.push({
          name: item,
          slug: item.toLowerCase().replace(/\s+/g, '-'),
          imageCount,
          path: `/images/${item}`
        });
      }
    });

    res.json({
      message: 'Categories retrieved successfully',
      count: categories.length,
      categories
    });

  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      error: 'Failed to retrieve categories',
      details: error.message
    });
  }
};
