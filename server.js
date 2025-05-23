import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';
//configure dotenv
dotenv.config();
//database config
connectDB();
//rest object
const app= express();
//configure middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);
//rest api
app.get('/', (req, res)=>{
res.send('<h1>Node.js Rest API</h1>');
});
const PORT= process.env.PORT||8080;
//run listen
app.listen(PORT, ()=>{
    console.log(`Server is running on ${process.env.DEV_MODE} on port ${PORT}`);
})