const express = require('express')
const userRouter = express.Router()

const {login , register, profile ,logout , accept ,refuse, changePassword, getAllUsers, getActiveUsers, getNotActiveUsers , forgotPassword , confirmForgotPasswort , addAdmin} = require('../contollers/userControllers')

userRouter.post('/login' , login)
userRouter.post('/register' , register)
userRouter.post('/profile' , profile)//send token return user
userRouter.post('/logout' , logout)
userRouter.post('/accept/:userId'  , accept)//accept users
userRouter.post('/refuse/:userId'  , refuse)//refuser users 
userRouter.get('/all'  , getAllUsers)//refuser users 
userRouter.get('/active'  , getActiveUsers)//refuser users 
userRouter.get('/inactive'  , getNotActiveUsers)//refuser users 
userRouter.put('/changePassword' , changePassword)
userRouter.post('/forgotPassword' , forgotPassword)
userRouter.post('/confirmForgotPasswort' , confirmForgotPasswort)
userRouter.post('/addAdmin' , addAdmin)
//get users 
module.exports = userRouter