const express = require('express')
const userRouter = express.Router()

const {login , register, profile ,logout , accept ,refuse} = require('../contollers/userControllers')

userRouter.post('/login' , login)
userRouter.post('/register' , register)
userRouter.post('/profile' , profile)
userRouter.post('/logout' , logout)
userRouter.post('/accept/:userId'  , accept)
userRouter.post('/refuse/:userId'  , refuse)

module.exports = userRouter