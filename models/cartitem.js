var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var cartItemSchema = mongoose.Schema({
    productId: {
        type:ObjectId,
        ref: "products"
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('cartitems', cartItemSchema);
