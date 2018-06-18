var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var cartSchema = mongoose.Schema({
    cartItem: [{
        type:ObjectId,
        ref: "cartItem"
    }],
    totalQty: {
        type: Number,
        default : 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
    
});
module.exports = mongoose.model('carts', cartSchema);