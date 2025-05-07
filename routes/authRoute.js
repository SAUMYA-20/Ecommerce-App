import express from 'express';
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getOrderDetailsController, getAllOrdersController, orderStatusController, getAllUsers, getDeliveredDetails, countryWiseChartController, stateWiseChartController} from '../controllers/authController.js'; 
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
// router object
const router = express.Router();

//routing

//register||method post
router.post('/register', registerController)

// login || post
router.post ('/login', loginController)

//forget password || post
router.post('/forgot-password', forgotPasswordController)

// test routes
router.get('/test', requireSignIn, isAdmin, testController)

//protected route auth for user
router.get('/user-auth', requireSignIn, (req, res)=>{
    res.status(200).send({ok:true});
});

//protected route auth for admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res)=>{
    res.status(200).send({ok:true});
});

//update profile
router.put('/update-profile', requireSignIn, updateProfileController)

//orders
router.get('/orders', requireSignIn, getOrdersController)

//order details
router.get('/orders/:orderId', requireSignIn, getOrderDetailsController)

//get all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

//get all users
router.get("/users", requireSignIn, isAdmin, getAllUsers);

// delivered
router.get("/delivered", requireSignIn, isAdmin, getDeliveredDetails);

router.get('/deliveries/countrywise', countryWiseChartController);
router.get('/deliveries/statewise', stateWiseChartController);

export default router;