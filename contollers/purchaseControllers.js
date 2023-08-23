
const Purchase = require('../models/purchaseModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const jwt = require('jsonwebtoken')
const create = async (req, res) => {
    const { additional } = req.body;
    const { token } = req.headers;

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }

            const user = await User.findOne({ email: data.user.email });
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            const cart = await Cart.findOne({ userId: user._id });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ error: "Cart is empty" });
            }

            // Ensure additional is a valid number, otherwise set it to 0
            const additionalValue = !isNaN(parseFloat(additional)) ? parseFloat(additional) : 0;

            let totalPrice = 0;
            for (const cartItem of cart.items) {
                const product = await Product.findById(cartItem.product);
                if (!product) {
                    return res.status(400).json({ error: "Product not available" });
                }
                totalPrice += product.price * cartItem.quantity;
            }
            totalPrice += additionalValue; 
            
            const purchase = await Purchase.create({
                purchaser: user._id,
                items: cart.items,
                additional: additionalValue,
                total: totalPrice,
            });

            res.status(200).json({ purchase });
        });
    } catch (error) {
        res.status(400).json({ error });
    }
}
const accept = async (req, res) => {

    const { purchaseId } = req.params
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const purchase = await Purchase.findOne({ _id: purchaseId })
            if (!purchase) {
                return res.status(400).json({ error: "no purchase" })
            }
            purchase.state = "delivered"
            purchase.modifiedBy = admin._id
            purchase.save()

            res.status(200).json({ message: "purchase is accepted", purchase })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const refuse = async (req, res) => {
    const { purchaseId } = req.params
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const purchase = await Purchase.findOne({ _id: purchaseId })
            if (!purchase) {
                return res.status(400).json({ error: "no purchase" })
            }
            purchase.state = "refused"
            purchase.modifiedBy = admin._id
            purchase.save()

            res.status(200).json({ message: "purchase is refused", purchase })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const getAllpurchases = async (req, res) => {
    const { token } = req.headers
    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const admin = await User.findOne({ email: data.user.email })
            if (!admin.isAdmin) {
                return res.status(400).json({ error: " authorisation error" })
            }
            const purchases = await Purchase.find({}).populate({
                path: 'items.product',
                select: 'name price quantity',
            });
            res.status(200).json({ purchases })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const getPurchases = async (req, res) => {

    const { token } = req.headers

    try {
        jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Invalid token" });
            }
            const user = await User.findOne({ email: data.user.email })
            const purchases = await Purchase.find({ purchaser: user._id }).populate({
                path: 'items.product',
                select: 'name price quantity',
            });

            res.status(200).json({ purchases })
        })
    } catch (error) {
        res.status(400).json({ error })
    }

}
module.exports = { create, accept, refuse, getAllpurchases, getPurchases }