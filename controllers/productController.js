import slugify from "slugify";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import User from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import orderModel from "../models/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
// console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// console.log("Razorpay Instance:", razorpayInstance);
// console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);
export const createProductController=async(req, res)=>{
    try{
        const {name, slug, description, price, category, quantity}=req.fields;
        const {photo}=req.files;
        //validation
        switch(true){
            case !name:
                return res.status(400).send({error:"Name is required"});
            case !description:
                return res.status(400).send({error:"Description is required"});
            case !price:
                return res.status(400).send({error:"Price is required"});
            case !category:
                return res.status(400).send({error:"Category is required"});
            case !quantity:
                return res.status(400).send({error:"Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(400).send({error:"Photo is required and should be less than 1mb"});
        }
        //create product
        const products = new productModel({
            ...req.fields,
            slug:slugify(name),
            photo:photo ? {data:fs.readFileSync(photo.path), contentType:photo.type}:undefined,
        });
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product created successfully",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in creating product",
            error,
        })
    }
}

//get all products
export const getProductController=async(req, res)=>{
    try{
        const products= await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:"All products",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting products",
            error,
        })
    }
}

//get single product
export const getSingleProductController=async(req, res)=>{
    try{
        const product= await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not found",
            })
        }
        res.status(200).send({
            success:true,
            message:"Single product fetched successfully",
            product,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting single product",
            error,
        })
    }
}

//get photo
export const productPhotoController=async(req, res)=>{
    try{
        const product= await productModel.findById(req.params.pid).select("photo");
        if(!product.photo.data){
            return res.status(404).send({
                success:false,
                message:"Photo not found",
            })
        }
        res.set("Content-Type", product.photo.contentType);
        return res.status(200).send(product.photo.data);
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting photo",
            error,
        })
    }
}

//delete product
export const deleteProductController=async(req, res)=>{
    try{
        const product= await productModel.findByIdAndDelete(req.params.pid).select("-photo").populate("category");
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not found",
            })
        }
        res.status(200).send({
            success:true,
            message:"Product deleted successfully",
            product,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting product",
            error,
        })
    }
}

//update product
export const updateProductController=async(req, res)=>{
    try{
        const {name, slug, description, price, category, quantity}=req.fields;
        const {photo}=req.files;
        //validation
        switch(true){
            case !name:
                return res.status(400).send({error:"Name is required"});
            case !description:
                return res.status(400).send({error:"Description is required"});
            case !price:
                return res.status(400).send({error:"Price is required"});
            case !category:
                return res.status(400).send({error:"Category is required"});
            case !quantity:
                return res.status(400).send({error:"Quantity is required"});
            case photo && photo.size > 1000000:
                return res.status(400).send({error:"Photo is required and should be less than 1mb"});
        }
        //update product
        const products = await productModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields,
            slug:slugify(name),
            photo:photo ? {data:fs.readFileSync(photo.path), contentType:photo.type}:undefined,
        }, {new:true});
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product updated successfully",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating product",
            error,
        })
    }
}

//filters
export const productFiltersController=async(req, res)=>{
    try{
        const {checked, radio}=req.body;
        let args={};
        if(checked.length > 0) args.category=checked;
        // if(radio.length > 0) args.price={$lte:radio};
        if(radio.length > 0) args.price={$gte: radio[0], $lte:radio[1]};
        const products= await productModel.find(args);
        res.status(200).send({
            success:true,
            message:"Filtered products fetched successfully",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting filtered products",
            error,
        })
    }
}

//product count
export const productCountController=async(req, res)=>{
    try{
        const total= await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            message:"Total products count",
            total,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting products count",
            error,
        })
    }
}

//product list based on page number
export const productListController=async(req, res)=>{
    try{
        const perPage=4;
        const page=req.params.page ? req.params.page : 1;
        const products= await productModel.
            find({})
            .select("-photo")
            .populate("category")
            .limit(perPage)
            .skip((page-1)*perPage)
            .sort({createdAt:-1});
        res.status(200).send({
            success:true,
            message:"Products fetched successfully",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting products",
            error,
        })
    }
}

//product search
export const searchProductController=async(req, res)=>{
    try{
        const {keyword}=req.params;
        const products= await productModel.find({
            $or:[
                {name:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},
            ]
        }).select("-photo");
        res.status(200).send({
            success:true,
            message:"Products fetched successfully",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting products",
            error,
        })
    }
}

//related similar products
export const relatedProductController=async(req, res)=>{
    try{
        const {pid, cid}=req.params;
        const products= await productModel.find({
            category:cid,
            _id:{$ne:pid},
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success:true,
            message:"Related products fetched successfully",
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting related products",
            error,
        })
    }
}

//product category wise products
export const productCategoryController=async(req, res)=>{
    try{
        const {slug}=req.params;
        const category= await categoryModel.findOne({slug:req.params.slug});
        const products= await productModel.find({category}).select("-photo").populate("category")
        res.status(200).send({
            success:true,
            message:"Category wise products fetched successfully",
            category,
            products,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting category wise products",
            error,
        })
    }
}
//add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res
      .status(200)
      .json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to add to wishlist' });
  }
};

// Remove from Wishlist
// export const removeFromWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const user = await userModel.findById(req.user._id);
//     user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
//     await user.save();
//     res
//       .status(200)
//       .json({ success: true, message: 'Product removed from wishlist' });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: 'Failed to remove from wishlist' });
//   }
// };

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate('wishlist.product');
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch wishlist' });
  }
};


//payment gateway api
export const createOrderController = async (req, res) => {
    try {
      // Extract data from the request body
      const { products, payment, buyer, totalAmount, currency, status } = req.body;
  
      // Validate required fields
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).send({
          success: false,
          message: "Products are required and must be an array.",
        });
      }
      if (!payment) {
        return res.status(400).send({
          success: false,
          message: "Payment details are required.",
        });
      }
      if (!buyer) {
        return res.status(400).send({
          success: false,
          message: "Buyer ID is required.",
        });
      }
      if (!totalAmount || typeof totalAmount !== 'number') {
        return res.status(400).send({
          success: false,
          message: "Total amount is required and must be a number.",
        });
      }
      if (status && !['Not Processed', 'Cash on Delivery', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return res.status(400).send({
          success: false,
          message: "Invalid status value.",
        });
      }
  
      // Create a Razorpay order
      const options = {
        amount: totalAmount*100,
        currency: currency || 'INR',
        receipt: `receipt_${Date.now()}`,
      };
      const razorpayOrder = await razorpayInstance.orders.create(options);
      
      // Save the order details to the database
      const newOrder = await orderModel.create({
        products,
        payment: {
          razorpay_order_id: razorpayOrder.id, // Save Razorpay order ID
        },
        buyer,
        totalAmount,
        currency: currency || 'INR',
        status: status || 'Not Processed',
      });
  
      // Send the response
      res.status(200).send({
        success: true,
        message: "Order created successfully",
        order: {
            razorpay_order_id: newOrder.payment.razorpay_order_id,
            products: newOrder.products,
            totalAmount: newOrder.totalAmount,
            currency: newOrder.currency,
            status: newOrder.status,
        },
      });
    } catch (error) {
      console.error("Error details:", error.message);
      res.status(500).send({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  };
//verify payment
export const verifyPaymentController = async (req, res) => {
    try {
      // Extract Razorpay details from the request body
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).send({
          success: false,
          message: "All Razorpay details (order ID, payment ID, signature) are required.",
        });
      }
  
      // Generate the expected signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
  
      console.log("Generated Signature:", generatedSignature);
      console.log("Received Signature:", razorpay_signature);
  
      // Compare signatures
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).send({
          success: false,
          message: "Invalid signature",
        });
      }
  
      // Find the order in the database using the Razorpay order ID
      const order = await orderModel.findOne({ "payment.razorpay_order_id": razorpay_order_id });
  
      if (!order) {
        return res.status(404).send({
          success: false,
          message: "Order not found in the database.",
        });
      }
  
      // Update the order with Razorpay payment details
      order.payment.razorpay_payment_id = razorpay_payment_id;
      order.payment.razorpay_signature = razorpay_signature;
      order.paymentStatus = 'Paid'; // Mark the order as paid
      await order.save();
  
      console.log("Order Updated in Database:", order);
  
      // Send the response
      res.status(200).send({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    } catch (error) {
      console.error("Error verifying payment:", error.message);
      res.status(500).send({
        success: false,
        message: "Error verifying payment",
        error: error.message,
      });
    }
  };

// //save cart
// export const saveCartController=async(req, res)=>{
//     try{
//         const {cart}=req.body;
//         const user= await userModel.findByIdAndUpdate(req.user._id, {cart}, {new:true});
//         res.status(200).send({
//             success:true,
//             message:"Cart saved successfully",
//             cart:user.cart,
//         })
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:"Error in saving cart",
//             error,
//         })
//     }
// }
  
// //get Cart 
// export const getCartController=async(req, res)=>{
//     try{
//         const user= await userModel.findById(req.user._id).populate("cart.product");
//         res.status(200).send({
//             success:true,
//             message:"Cart fetched successfully",
//             cart:user.cart,
//         })
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:"Error in getting cart",
//             error,
//         })
//     }
//   }
  
