
const productRouter = require('express').Router()
const { createProduct , updateProduct , deleteProduct , getProduct , getProducts , getAllDeleted, search, getAllActive, getProductByCategoryUsers, getProductByCategoryAdmins} = require('../contollers/productControllers')
productRouter.get('/' , getProducts)
productRouter.post('/create' , createProduct)
productRouter.put('/update/:productId' , updateProduct)
productRouter.put('/delete/:productId' , deleteProduct)
productRouter.post('/product/:productId' , getProduct)
productRouter.post('/product/deleted' , getAllDeleted)
productRouter.post('/product/accepted' , getAllActive)
productRouter.post('/user/product/category/:categoryId' , getProductByCategoryUsers)
productRouter.post('/admin/product/category/:categoryId' , getProductByCategoryAdmins)
productRouter.get('/search' , search)


module.exports = productRouter