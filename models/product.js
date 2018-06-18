var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var productSchema = mongoose.Schema({

    title: { 
        type: String,
        trim: true,
        required: true
    },
    brandName: {
        type: String
    },
    serialNumber: {
        type: Number,
        required: true,
        index: true
    },
    description: {
        type: String
    },
    imgUrl : {
        type: String
    },
    price: {
        type: Number, 
        default: 0
    },
    categories: {
        type: ObjectId,
        ref: 'categories'
    }
});
module.exports = mongoose.model('products', productSchema);
