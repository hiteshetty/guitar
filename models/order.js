var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var orderSchema = mongoose.Schema({
    orderId:{
        type:String,
        unique:true
    },
    payment: {
        type: Number,
    },
    timeStamp:Number,
    products:[
        { 
            productId : {
                type: ObjectId,
                ref: "products"
            },
            price:{
                type : Number, 
            }
        }
    ]
});
module.exports = mongoose.model('orders', orderSchema);