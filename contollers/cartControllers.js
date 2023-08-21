const Cart = require('../models/cartModel');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { token } = req.headers
  try {
    await jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: 'Invalid token' });
      }
      const user = await User.findOne({ email: data.user.email })
      console.log(user)
      let cart = await Cart.findOne({ userId: user._id });
      if (!cart) {
        cart = await Cart.create({ userId: user._id, items: [] });
      }

      const existingItemIndex = cart.items.findIndex((item) => item.product.equals(productId));
      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();

      res.status(200).json({ cart });
    })
  } catch (error) {
    res.status(400).json({ error });
  }
};

const removeFromCart = async (req, res) => {
  const {productId } = req.body;
  const  {token} = req.headers
  try {
    await jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: 'Invalid token' });
      }
      const user = await User.findOne({ email: data.user.email })
      const cart = await Cart.findOne({ userId: user._id });
      if (!cart) {
        return res.status(400).json({ error: 'Cart not found' });
      }
      cart.items = cart.items.filter((item) => !item.product.equals(productId));
      await cart.save();
      res.status(200).json({ cart });
    })
  } catch (error) {
    res.status(400).json({ error });
  }
};

const removeAllItemsFromCart = async (req, res) => {

  const {token} = req.headers
  try {
    await jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
    }
      const user = await User.findOne({ email: data.user.email })
      const cart = await Cart.findOne({ userId: user._id })
    if (!cart) {
      return res.status(400).json({ error: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();

    res.status(200).json({ cart });
  })
  } catch (error) {
    res.status(400).json({ error });
  }
};
const getCart = async (req, res) => {
  const { token } = req.headers;
  try {
    await jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: 'Invalid token' });
      }
      const user = await User.findOne({ email: data.user.email });
      const cart = await Cart.findOne({ userId: user._id }).populate('items.product');

      if (!cart) {
        return res.status(400).json({ error: 'Cart not found' });
      }

      res.status(200).json({ cart });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = { addToCart, removeFromCart, removeAllItemsFromCart , getCart };