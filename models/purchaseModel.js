const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchaseModel = new Schema({

    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    items : [{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity : {
            required : true ,
            type : Number
        }
    }],
    additional : {
        type : Number 
    },
    modifiedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    state : {
        type :  String ,
        default : 'pending'
    },
    total : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('Purchase' , purchaseModel)