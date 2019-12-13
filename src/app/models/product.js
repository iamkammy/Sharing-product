const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productId: {
        type: Schema.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
}, { _id: false, timestamps: true });

module.exports = ProductSchema;