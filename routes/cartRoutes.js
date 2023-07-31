
const express = require('express');
const cartRouter = express.Router();
const { addToCart , removeFromCart , removeAllItemsFromCart , getCart} = require('../contollers/cartControllers')

cartRouter.post('/add', addToCart);
cartRouter.post('/remove', removeFromCart);
cartRouter.post('/removeAll', removeAllItemsFromCart); 
cartRouter.post('/get', getCart)
module.exports = cartRouter