
const productRouter = require('express').Router()
const { createProduct , updateProduct , deleteProduct , getProduct , getProducts , getDeleted, search} = require('../contollers/productControllers')
productRouter.post('/create' , createProduct)
productRouter.put('/update/:productId' , updateProduct)
productRouter.put('/delete/:productId' , deleteProduct)
productRouter.get('/' , getProducts)
productRouter.get('/product/:productId' , getProduct)
productRouter.get('/search' , search)

module.exports = productRouter