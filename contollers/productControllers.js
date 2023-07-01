
const Product = require('../models/productModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createProduct = async (req, res) => {

    const { name, price, images, description, quantity, volume, brand, category } = req.body
    const { token } = req.headers

    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
        console.log(data)
        //       
        if (!name || !price || !images || !description || !quantity || !category) {
            return res.status(400).json({ error: "name , price , images , quantity are required" })
        }

        //check if the user is admin 
        const admin = await User.findOne({ email: data.user.email })
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }
        const product = await Product.create({
            owner: admin._id,
            name, price, images, description, quantity, volume, brand, category
        })
        res.status(200).json({ message: "product created successfully", product })

    })

}

const updateProduct = async (req, res) => {
    const { productId } = req.params
    try {
        const product = await Product.findOne({ _id: productId })
        const { name, price, images, description, quantity, volume, brand, category } = req.body
        const { token } = req.headers
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            console.log(data)
            //       
            if (!name || !price || !images || !description || !quantity || !category) {
                return res.status(400).json({ error: "name , price , images , quantity are required" })
            }

            const admin = await User.findOne({ email: data.user.email })
            //check if the user is admin 
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }

            const product = await Product.findOneAndUpdate({ _id: productId }, { owner: admin._id, name, price, images, description, quantity, volume, brand, category })
            res.status(200).json({ message: "product updated successfully", product })

        })

    } catch (error) {
        res.status(400).json({ error })
    }
}

const deleteProduct = async (req, res) => {
    const { productId } = req.params
    const { token } = req.headers
    try {
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (error, data) => {
        console.log(data)
        const admin = await User.findOne({ email: data.user.email })
        //check if the user is admin 
        if (!admin.isAdmin) {
            return res.status(400).json({ error: " authorisation error" })
        }

        const product = await Product.find({ _id: productId })

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const deletedProduct = await Product.updateOne({_id : productId} , {state : "archived"})
        res.status(200).json({message : "product archived successfully"})
    })
    } catch (error) {

    }
}

const getProduct = async (req, res) => {
    const { productId } = req.params
    try {
        const product = await Product.findOne({ _id: productId })
        if (!product || product.state !== "active") {
            return res.status(400).json({ error: "product is not found" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const getProducts = async (req, res) => {


    try {
        const product = await Product.find({ state: "active" })
        res.status(200).json({ product })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const getDeleted = async (req, res) => {


    try {
        const product = await Product.find({ state: "archived" })
        res.status(200).json({ product })
    } catch (error) {
        res.status(400).json({ error })
    }
}
//search?query=example
const search = async (req , res) => {
    const { query } = req.query;

    try {
      const products = await Product.find({
        $and: [
          { state: "active" },
          {
            $or: [
              { name: { $regex: query, $options: "i" } }, 
              { description: { $regex: query, $options: "i" } }, 
              { brand: { $regex: query, $options: "i" } }
            ]
          }
        ]
      });
  
      res.status(200).json({ products });
    } catch (error) {
      res.status(400).json({ error });
    }
}
module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
    getDeleted,
    search
}