const express = require('express')
const purchaseRouter = express.Router()
const { create,
    accept,
    refuse,
    getAllpurchases,
    getPurchases } = require('../contollers/purchaseControllers')

purchaseRouter.post('/create', create)
purchaseRouter.put('/accept/:purchaseId', accept)
purchaseRouter.put('/refuse/:purchaseId', refuse)
purchaseRouter.post('/getAll', getAllpurchases)
purchaseRouter.post('/get', getPurchases)

module.exports = purchaseRouter