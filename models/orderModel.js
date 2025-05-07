import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
      products: [
        {
          product: {
            type: mongoose.ObjectId,
            ref: 'Products',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      payment: {
        type: Object,
      },
      buyer: {
        type: mongoose.ObjectId,
        ref: 'users',
      },
      status: {
        type: String,
        default: 'Not Processed',
        enum: [
          'Not Processed',
          'Processing',
          'Shipped',
          'Delivered',
          'Cancelled'
        ],
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      razorpay_order_id: {
        type: String,
      },
      razorpay_payment_id: {
        type: String,
      },
      razorpay_signature: {
        type: String,
      },
      paymentStatus: {
        type: String,
        default: 'Not Paid',
        enum: ['Not Paid', 'Paid'],
      },
    },
    { timestamps: true }
  );

export default mongoose.model('Order', orderSchema);