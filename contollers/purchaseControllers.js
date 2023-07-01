
const Purchase = require('../models/purchaseModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const jwt = require('jsonwebtoken')
const create = async (req, res) => {
    const { purchaser, items, additional } = req.body
    try {

        const user = await User.findById(purchaser)
        if(!user){
            return res.status(400).json({error : "user not found"})
        }
        // Calculate the total price based on the items and additional cost
        let totalPrice = 0;
        for (const item of items) {
            const product = await Product.findById(item.id);
            if (!product) {
                return res.status(400).json({ error: "Product not available" });
            }
            totalPrice += product.price * item.quantity;
        }
        totalPrice += additional; // Add the additional cost to the total price

        // Create a new purchase object based on the model
        const purchase = await Purchase.create({
            purchaser,
            items,
            additional,
            total: totalPrice
        })

        res.status(200).json({purchase})

    } catch (error) {

    }
}

const accept = async (req, res) => {

    const {purchaseId} = req.params
    const {token} = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }     
            const purchase = await Purchase.findOne({_id : purchaseId})
            if(!purchase){
                return res.status(400).json({error : "no purchase"})
            }
            purchase.state = "delivered"
            purchase.modifiedBy = admin._id
            purchase.save()
    
            res.status(200).json({message : "purchase is accepted" , purchase})
        })
    } catch (error) {
        res.status(400).json({error})
    }
}

const refuse = async (req, res) => {
    const {purchaseId} = req.params
    const {token} = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }     
            const purchase = await Purchase.findOne({_id : purchaseId})
            if(!purchase){
                return res.status(400).json({error : "no purchase"})
            }
            purchase.state = "refused"
            purchase.modifiedBy = admin._id
            purchase.save()
    
            res.status(200).json({message : "purchase is refused" , purchase})
        })
    } catch (error) {
        res.status(400).json({error})
    }
}

const getAllpurchases = async (req, res) => {
        const {token} = req.headers
        try {
            jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
                const admin = await User.findOne({ email: data.user.email })
                if (!admin.isAdmin) {
                    return res.status(400).json({ error: " authorisation error" })
                }
                    const purchases = await Purchase.find({})
                    res.status(200).json({purchases})
                })
    } catch (error) {
        res.status(400).json({error})
    }
}

const getPurchases = async (req, res) => {

    const {token} = req.headers

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            const user = await User.findOne({ email: data.user.email })
            const purchases = await Purchase.find({purchaser : user._id})

            res.status(200).json({purchases})
            })
    } catch (error) {
        res.status(400).json({error})
    }

}
module.exports = { create, accept, refuse, getAllpurchases, getPurchases }