
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const createCategory = async (req, res) => {
    const { name, image } = req.body
    const { token } = req.headers

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            if(!name || !image){
                return res.status(400).json({error : "all fields are required"})
            }
            //check if the user is admin 
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const category = await Category.create({
                name : name.trim() , 
                image , 
                owner : admin._id})
            res.status(200).json({ message: "category created successfully", category })
    
        })
    } catch (error) {
        
    }
}

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { token } = req.headers;

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).json({ error: "Category doesn't exist" });
            }

            const admin = await User.findOne({ email: data.user.email });
            if (!admin.isAdmin) {
                return res.status(400).json({ error: "Authorization error" });
            }

            
            await Product.updateMany(
                { category: category._id },
                { $pull: { category: category._id } }
            );

            const deletedCategory = await Category.findByIdAndDelete(category._id);
            res.status(200).json({ message: "Category deleted successfully", deletedCategory });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateCategory = async (req, res) => {
    const {categoryId} = req.params 
    const { name, image } = req.body
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const category = await Category.findById(categoryId)
            if(!category){
                return res.status(400).json({error : "category doesn't exist"})
            }
           
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
    
            const updatedCategory = await Category.findByIdAndUpdate(category._id , {
                name , 
                image , 
                owner : admin._id
            })
            res.status(200).json({ message: "category updated successfully", updatedCategory })
    
        })
    } catch (error) {
        
    }

    
}

const getCategory = async (req, res) => {
    const {categoryId} = req.params
    const {token} = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
        const user = await User.findOne({email : data.user.email})
        if(!user){
            return res.status(400).json({error : "user doesnt exist"})
        }
        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(400).json({error : "category does not exist"})
        }

        res.status(200).json({category})
    })
    } catch (error) {
        
    }
}

const getCategories = async (req, res) => {

    const {token} = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const user = await User.findOne({email : data.user.email})
            if(!user){
                return res.status(400).json({error : "user doesnt exist"})
            }
            const categories = await Category.find({})
            res.status(200).json({categories})
        })
    } catch (error) {
        
    }
}

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getCategories }