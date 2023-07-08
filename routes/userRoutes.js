const express = require('express')
const userRouter = express.Router()

const {login , register, profile ,logout , accept ,refuse, changePassword} = require('../contollers/userControllers')

userRouter.post('/login' , login)
userRouter.post('/register' , register)
userRouter.post('/profile' , profile)//send token return user
userRouter.post('/logout' , logout)
userRouter.post('/accept/:userId'  , accept)//accept users
userRouter.post('/refuse/:userId'  , refuse)//refuser users
userRouter.put('/changePassword' , changePassword)
module.exports = userRouter