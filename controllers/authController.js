import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from 'jsonwebtoken';
export const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      answer,
      country,
      state,
      city,
    } = req.body;
    //validations
    if (!name) {
      return res.send({ message: 'Name is Required' });
    }
    if (!email) {
      return res.send({ message: 'Email is Required' });
    }
    if (!password) {
      return res.send({ message: 'Password is Required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone no is Required' });
    }
    if (!address) {
      return res.send({ message: 'Address is Required' });
    }
    if (!country) {
      return res.send({ message: 'Country is Required' });
    }
    if (!state) {
      return res.send({ message: 'State is Required' });
    }
    if (!city) {
      return res.send({ message: 'City is Required' });
    }
    if (!answer) {
      return res.send({ message: 'Answer is Required' });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already Register please login',
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      country,
      state,
      city,
      password: hashedPassword,
      answer
    }).save();

    res.status(201).send({
      success: true,
      message: 'User Register Successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Registeration',
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email is not registerd',
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Invalid Password',
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(200).send({
      success: true,
      message: 'login successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error,
    });
  }
};

//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(404).send({
        success: false,
        message: 'All fields are required',
      });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email or answer',
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send('Protected Route Admin');
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address,country,state, city } = req.body;
    //update
    const user = await userModel.findById(req.user._id);
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
        password: password ? await hashPassword(password) : user.password,
        country: country || user.country,
        state: state || user.state,
        city: city || user.city,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Profile Updated Successfully',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in update profile',
      error,
    });
  }
};

//get all orders
export const getOrdersController = async (req, res) => {
  try {
    // Fetch orders for the logged-in user
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    // Send the response
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in Fetching Orders',
      error: error.message,
    });
  }
};

//get order details
export const getOrderDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findById(orderId)
      .populate(
        'products.product',
        'name slug price description photo quantity',
        'Product'
      ) // Correct way to populate product info
      .populate('buyer', 'name');

    if (!order) {
      return res.status(404).send({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Order details fetched successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in fetching order details',
      error: error.message,
    });
  }
};

//get all orders for admin
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate('products', '-photo')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: 'All Orders Fetched Successfully',
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in Fetching All Orders',
      error: error.message,
    });
  }
};

//update order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Order Status Updated Successfully',
      updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in Updating Order Status',
      error: error.message,
    });
  }
};

//get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users and exclude their password
    const users = await userModel.find({}).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

//get delivered order details
export const getDeliveredDetails = async (req, res) => {
  try {
    // Fetch orders with delivered status
    const deliveredOrders = await orderModel
      .find({ status: 'Delivered' })
      .populate('buyer', 'name email address')
      .populate('products', 'name price');

    res.status(200).json({
      success: true,
      deliveredOrders,
      message: 'Delivered order details fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching delivered details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivered order details',
      error: error.message,
    });
  }
};

// Get country-wise deliveries chart data
import mongoose from 'mongoose';

// Controller for fetching country-wise deliveries chart data
export const countryWiseChartController = async (req, res) => {
  try {
    // Aggregate data from the orderModel
    const chartData = await mongoose.model('Order').aggregate([
      // Match only delivered orders
      { $match: { status: 'Delivered' } },

      // Lookup to join with users collection
      {
        $lookup: {
          from: 'users', // Name of the users collection
          localField: 'buyer', // Field in the orderModel
          foreignField: '_id', // Field in the users collection
          as: 'buyer', // Output array field
        },
      },

      // Unwind the buyer array (created by $lookup)
      { $unwind: '$buyer' },

      // Group by country and count deliveries
      { $group: { _id: '$buyer.country', count: { $sum: 1 } } },

      // Project the desired output format
      { $project: { country: '$_id', count: 1, _id: 0 } },

      // Sort by count in descending order (optional)
      { $sort: { count: -1 } },
    ]);

    // Return the chart data
    res.status(200).json({ success: true, chartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country-wise chart',
      error: error.message,
    });
  }
};

// Controller for fetching state-wise deliveries chart data
export const stateWiseChartController = async (req, res) => {
  try {
    // Aggregate data from the orderModel
    const chartData = await mongoose.model('Order').aggregate([
      // Match only delivered orders
      { $match: { status: 'Delivered' } },

      // Lookup to join with users collection
      {
        $lookup: {
          from: 'users', // Name of the users collection
          localField: 'buyer', // Field in the orderModel
          foreignField: '_id', // Field in the users collection
          as: 'buyer', // Output array field
        },
      },

      // Unwind the buyer array (created by $lookup)
      { $unwind: '$buyer' },

      // Group by state and count deliveries
      { $group: { _id: '$buyer.state', count: { $sum: 1 } } },

      // Project the desired output format
      { $project: { state: '$_id', count: 1, _id: 0 } },

      // Sort by count in descending order (optional)
      { $sort: { count: -1 } },
    ]);

    // Return the chart data
    res.status(200).json({ success: true, chartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching state-wise chart',
      error: error.message,
    });
  }
};
