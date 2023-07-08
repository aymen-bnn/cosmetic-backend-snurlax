
const productRouter = require('express').Router()
const { createProduct , updateProduct , deleteProduct , getProduct , getProducts , getAllDeleted, search, getAllActive} = require('../contollers/productControllers')
productRouter.get('/' , getProducts)
productRouter.post('/create' , createProduct)
productRouter.put('/update/:productId' , updateProduct)
productRouter.put('/delete/:productId' , deleteProduct)
productRouter.post('/product/:productId' , getProduct)
productRouter.post('/product/deleted' , getAllDeleted)
productRouter.post('/product/accepted' , getAllActive)
productRouter.get('/search' , search)


module.exports = productRouter