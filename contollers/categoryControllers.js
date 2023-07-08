
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')

const createCategory = async (req, res) => {
    const { name, image } = req.body
    const { token } = req.headers

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if(!name || !image){
                return res.status(400).json({error : "all fields are required"})
            }
            //check if the user is admin 
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const category = await Category.create({name , image , owner : admin._id})
            res.status(200).json({ message: "category created successfully", category })
    
        })
    } catch (error) {
        
    }
}

const deleteCategory = async (req, res) => {

    const {categoryId} = req.params 
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {

            const category = await Category.findById(categoryId)
            if(!category){
                return res.status(400).json({error : "category doesn't exist"})
            }
           
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const deletedCategory = await Category.findByIdAndDelete(category._id)
            res.status(200).json({ message: "category deleted successfully", deletedCategory })
    
        })
    } catch (error) {
        
    }

}

const updateCategory = async (req, res) => {
    const {categoryId} = req.params 
    const { name, image , owner } = req.body
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {

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

    try {
        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(400).json({error : "category does not exist"})
        }

        res.status(200).json({category})
    } catch (error) {
        
    }
}

const getCategories = async (req, res) => {

    const categories = await Category.find({})
    res.status(400).json({categories})
}

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getCategories }