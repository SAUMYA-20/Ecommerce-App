import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('users', userSchema);


// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     state: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     country: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     answer: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     role: {
//       type: Number,
//       default: 0, // 0 = User, 1 = Admin
//     },
//     cart: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//       },
//     ],
//     wishlist: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model('User', userSchema);