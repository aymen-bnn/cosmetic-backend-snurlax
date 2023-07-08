const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productModel = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: Number,
            required: true
        },
        volume: {
            type: Number
        },
    },
    brand: {
        type: String
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      }],
    state: {
        type: String,
        default: "active"
    }
}, { timestamps: true })

module.exports = mongoose.model('Product', productModel)