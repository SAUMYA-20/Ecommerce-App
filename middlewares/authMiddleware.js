import JWT from 'jsonwebtoken';
import User from '../models/userModel.js';

//protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
      const decode = JWT.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      req.user = decode;
      next();
    } 
    catch (error) {
      console.log(error);
    }
};
//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id); 
        if (!user || user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access'
            });
        }
        next();
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Admin middleware or Internal Server Error'
        });
    }
};