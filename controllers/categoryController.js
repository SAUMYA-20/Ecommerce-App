import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        //validation
        if(!name){
            return res.status(401).send({
                success:false,
                message:"Name is required",
            });
        }
        //check category
        const existingCategory= await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success:false,
                message:"Category already exists",
            });
        }
        //create category
        const category=await new categoryModel({name, slug:slugify(name)}).save();
        res.status(200).send({
            success:true,
            message:"New Category Created",
            category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in creating category",
            error,
        });
    }
};


//update category
export const updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params;
        //validation
        if(!name){
            return res.status(401).send({
                success:false,
                message:"Name is required",
            });
        }
        //update category
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated",
            category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating category",
            error,
        });
    }
};

//get all categories
export const categoryController=async(req,res)=>{
    try{
        const categories=await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories",
            categories,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting categories",
            error,
        });
    }
};

//single category
export const singlecategoryController=async(req,res)=>{
    try{
        const category=await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Single Category Fetched",
            category,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting single category",
            error,
        });
    }
};

//delete category
export const deleteCategoryController=async(req,res)=>{
    try{
        const {id}=req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category Deleted",
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting category",
            error,
        });
    }
};