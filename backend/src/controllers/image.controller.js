import Image from '../models/Image.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import Joi from 'joi';

// Validation schemas
const imageCreateSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).allow(''),
  category: Joi.string().valid('landscape', 'portrait', 'abstract', 'nature', 'urban', 'fantasy', 'scifi', 'art', 'other').required(),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  aiModel: Joi.string().max(50).allow(''),
  prompt: Joi.string().max(2000).allow(''),
  isPublic: Joi.boolean().default(true)
});

const imageUpdateSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(1000).allow(''),
  category: Joi.string().valid('landscape', 'portrait', 'abstract', 'nature', 'urban', 'fantasy', 'scifi', 'art', 'other'),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  aiModel: Joi.string().max(50).allow(''),
  prompt: Joi.string().max(2000).allow(''),
  isPublic: Joi.boolean()
});

// Get all images with filters
export const getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { isPublic: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }

    // Execute query
    const images = await Image.find(query)
      .populate('uploadedBy', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      images,
      pagination: {
        currentPage: page,
        totalPages,
        totalImages: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching images'
    });
  }
};

// Get single image
export const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('uploadedBy', 'username avatar bio');

    if (!image) {
      return res.status(404).json({
        error: 'Image not found'
      });
    }

    // Check if image is public or user owns it
    if (!image.isPublic && (!req.user || image.uploadedBy._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        error: 'Access denied to private image'
      });
    }

    // Increment view count
    await Image.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ image });

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching image'
    });
  }
};

// Upload new image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided'
      });
    }

    // Validate metadata
    const { error, value } = imageCreateSchema.validate(req.body);
    if (error) {
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    // Process image with Sharp
    const imagePath = req.file.path;
    const metadata = await sharp(imagePath).metadata();
    
    // Generate thumbnail
    const thumbnailPath = imagePath.replace(/(\.[^.]+)$/, '_thumb$1');
    await sharp(imagePath)
      .resize(300, 300, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    // Create image record
    const imageData = {
      ...value,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      thumbnailUrl: `/uploads/${path.basename(thumbnailPath)}`,
      uploadedBy: req.user._id,
      metadata: {
        size: req.file.size,
        dimensions: {
          width: metadata.width,
          height: metadata.height
        },
        format: metadata.format,
        colorSpace: metadata.space || 'sRGB'
      }
    };

    const image = new Image(imageData);
    await image.save();

    // Populate uploader info
    await image.populate('uploadedBy', 'username avatar');

    res.status(201).json({
      message: 'Image uploaded successfully',
      image
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    console.error('Upload image error:', error);
    res.status(500).json({
      error: 'Internal server error during image upload'
    });
  }
};

// Update image
export const updateImage = async (req, res) => {
  try {
    const { error, value } = imageUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        error: 'Image not found'
      });
    }

    // Check ownership
    if (image.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied. You can only update your own images'
      });
    }

    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username avatar');

    res.json({
      message: 'Image updated successfully',
      image: updatedImage
    });

  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      error: 'Internal server error during image update'
    });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        error: 'Image not found'
      });
    }

    // Check ownership or admin
    if (image.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied. You can only delete your own images'
      });
    }

    // Delete physical files
    const imagePath = path.join(process.cwd(), 'uploads', image.filename);
    const thumbnailFilename = image.filename.replace(/(\.[^.]+)$/, '_thumb$1');
    const thumbnailPath = path.join(process.cwd(), 'uploads', thumbnailFilename);

    await Promise.all([
      fs.unlink(imagePath).catch(() => {}),
      fs.unlink(thumbnailPath).catch(() => {})
    ]);

    // Delete from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      error: 'Internal server error during image deletion'
    });
  }
};

// Get user's images
export const getUserImages = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { uploadedBy: userId };
    
    // Only show public images if not own profile
    if (!req.user || userId !== req.user._id.toString()) {
      query.isPublic = true;
    }

    const images = await Image.find(query)
      .populate('uploadedBy', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      images,
      pagination: {
        currentPage: page,
        totalPages,
        totalImages: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching user images'
    });
  }
};
