import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original name is required']
  },
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['landscape', 'portrait', 'abstract', 'nature', 'urban', 'fantasy', 'scifi', 'art', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  aiModel: {
    type: String,
    trim: true,
    maxlength: [50, 'AI Model name cannot exceed 50 characters'],
    default: ''
  },
  prompt: {
    type: String,
    trim: true,
    maxlength: [2000, 'Prompt cannot exceed 2000 characters'],
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  metadata: {
    size: {
      type: Number,
      required: true
    },
    dimensions: {
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      }
    },
    format: {
      type: String,
      required: true,
      enum: ['jpg', 'jpeg', 'png', 'webp', 'gif']
    },
    colorSpace: {
      type: String,
      default: 'sRGB'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
imageSchema.index({ category: 1, createdAt: -1 });
imageSchema.index({ uploadedBy: 1, createdAt: -1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for like count
imageSchema.virtual('likeCount').get(function() {
  return this.likes || 0;
});

// Pre-remove middleware to clean up files
imageSchema.pre('remove', async function(next) {
  // Here you could add logic to delete physical files
  // from storage (local or cloud)
  next();
});

export default mongoose.model('Image', imageSchema);
