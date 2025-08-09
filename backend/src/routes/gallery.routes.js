import express from 'express';
import { getImages, getImagesByCategory, getCategories } from '../controllers/gallery.controller.js';

const router = express.Router();

// GET /api/gallery - Get all images
router.get('/', getImages);

// GET /api/gallery/categories - Get all categories
router.get('/categories', getCategories);

// GET /api/gallery/category/:category - Get images by category
router.get('/category/:category', getImagesByCategory);

export default router;
