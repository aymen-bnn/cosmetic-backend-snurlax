const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoryModel = new Schema({

    name : {
        type : String , 
        required : true
    },
    image : {
        type : String , 
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    }
})

module.exports = mongoose.model('Category' , categoryModel)