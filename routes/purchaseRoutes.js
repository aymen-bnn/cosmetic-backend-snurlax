const express = require('express')
const purchaseRouter = express.Router()
const { create,
    accept,
    refuse,
    getAllpurchases,
    getPurchases, 
    getPurchase} = require('../contollers/purchaseControllers')

purchaseRouter.post('/create', create)
purchaseRouter.put('/accept/:purchaseId', accept)
purchaseRouter.put('/refuse/:purchaseId', refuse)
purchaseRouter.get('/get/:purchaseId', getPurchase)
purchaseRouter.get('/get', getPurchases)
purchaseRouter.get('/getAll', getAllpurchases)

module.exports = purchaseRouter