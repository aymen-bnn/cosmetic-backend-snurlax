
const categoryRouter = require('express').Router()
const { createCategory, updateCategory, deleteCategory, getCategory, getCategories } = require('../contollers/categoryControllers')

categoryRouter.post('/create' , createCategory)
categoryRouter.delete('/delete/:categoryId' , deleteCategory)
categoryRouter.put('/update/:categoryId' , updateCategory)
categoryRouter.get('/get/:categoryId' , getCategory)
categoryRouter.get('/' , getCategories)
module.exports = categoryRouter