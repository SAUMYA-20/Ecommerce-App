import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singlecategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router()
// create routes
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);
// update routes
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);
//get all category
router.get('/get-category', categoryController);
//get single category
router.get('/get-category/:slug', singlecategoryController);
//delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);
export default router