
const productRouter = require('express').Router()
const { createProduct , updateProduct , deleteProduct , getProduct , getProducts , getAllDeleted, search, getAllActive, getProductByCategoryUsers, getProductByCategoryAdmins , getProductsAdmin} = require('../contollers/productControllers')
productRouter.get('/' , getProducts)
productRouter.get('/getAll' , getProductsAdmin)
//admin 
productRouter.post('/create' , createProduct)
productRouter.post('/update/:productId' , updateProduct)
productRouter.post('/delete/:productId' , deleteProduct)
productRouter.post('/product/:productId' , getProduct)
productRouter.get('/product/deleted' , getAllDeleted)
productRouter.get('/product/accepted' , getAllActive)
productRouter.get('/product/user/category/:categoryId' , getProductByCategoryUsers)
productRouter.get('/product/user/category/:categoryId' , getProductByCategoryAdmins)
productRouter.get('/search' , search)


module.exports = productRouter