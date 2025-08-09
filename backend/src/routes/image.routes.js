import express from 'express';
import {
  getImages,
  getImage,
  uploadImage,
  updateImage,
  deleteImage,
  getUserImages
} from '../controllers/image.controller.js';
import auth, { optionalAuth } from '../middleware/auth.js';
import upload, { handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, getImages);
router.get('/:id', optionalAuth, getImage);
router.get('/user/:userId', optionalAuth, getUserImages);

// Protected routes
router.post('/', auth, upload.single('image'), handleUploadError, uploadImage);
router.put('/:id', auth, updateImage);
router.delete('/:id', auth, deleteImage);

export default router;
