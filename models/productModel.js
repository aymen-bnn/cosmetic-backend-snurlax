const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productModel = new Schema({
    owner:{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    },
    name : {
        type : String ,
        required : true
    } ,
    price : {
        type : Number ,
        required : String
    },
    images : {
        type : [String],
        required : true
    },
    description : {
        type : String,
        required : true
    },
    quantity : {
        type : Number ,
        required : true
    } ,
    volume : {
        type : Number 
    },
    brand : {
        type :String
    },
    category : {
        type :[String] ,
        required : true
    },
    state : {
        type : String ,
        default : "active"
    }
} , {timestamps : true})

module.exports = mongoose.model('Product' , productModel)