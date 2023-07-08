const mongoose = require('mongoose')

const Schema = require('mongoose').Schema

const userSchema = new Schema ({

    email : {
        type : String, 
        required : true
    } ,

    password : {
        type : String , 
        required : true
    } ,
    username : {
        type : String , 
        required : true
    } ,
    fullName : {
        type : String , 
        required : true
    } ,
    phone : {
        type : String , 
        required : true
    },
    active : {
        type : Boolean ,
        default : false
    },
    isAdmin : {
        type : Boolean ,
        default : false
    } ,
    favorites: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        }],
        default: []
      }
})

module.exports = mongoose.model('User' , userSchema)