import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  createOrderController,
  verifyPaymentController,
  addToWishlist,
  // removeFromWishlist,
  getWishlist,
  // saveCartController,
  // getCartController,
} from '../controllers/productController.js';
import formidable from 'express-formidable';
const router = express.Router();
//routes
router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//route for update product
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get('/get-product', getProductController);

//get single product
router.get('/get-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete(
  '/delete-product/:pid',
  requireSignIn,
  isAdmin,
  deleteProductController
);

//filter product
router.post('/product-filters', productFiltersController);

//count product
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//search product
router.get('/search/:keyword', searchProductController);


//get similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//get product by category
router.get('/product-category/:slug', productCategoryController);

//wishlist routes
//add
router.post('/add', requireSignIn, addToWishlist);
//remove
// router.delete('/remove-wishlist/:id', requireSignIn, removeFromWishlist);
//get wishlist
router.get('/get-wishlist', requireSignIn, getWishlist);

// // cart routes
// router.post('/save-cart', requireSignIn, saveCartController);
// //get cart
// router.get('/get-cart', requireSignIn, getCartController);

//payments routes
//create order
router.post('/create-order', requireSignIn, createOrderController); 
// verify Razorpay order
router.post('/verify-payment', requireSignIn, verifyPaymentController); 

export default router;