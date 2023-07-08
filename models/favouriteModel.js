
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favouriteModel = new Schema({

    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    },
    products : [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId ,
                ref : 'Product'
            },
        }
    ]
})