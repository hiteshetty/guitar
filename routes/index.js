var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Cart = require('../models/cart.js');
var CartItem = require('../models/cartitem.js');
var Categories = require('../models/categories.js');

/* GET home page. */
router.get('/', function(req, res, next){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({title: regex}, function(err, data){
            console.log(data);
        if(err){
            console.log(err);
        } else {
            if(data.length < 1) {
                noMatch = "No data match that query, please try again.";
            }
            
            res.render("shop/index",{ products : data, noMatch: noMatch,  title: 'Guitar Store' });
        }
        });
    } else {
        Product.find({}, function(err, data){
        if(err){
            console.log(err);
        } else {
            res.render("shop/index",{products : data, noMatch: noMatch, title: 'Guitar Store'});
        }
        });
    }
});

//shopping page
router.get('/cart', function(req, res, next){
	var b = {};
    try {
        b = JSON.parse(req.body.body);
    } catch(e) {
        b = req.body;
    }
    CartItem.find({})
        .populate('productId')
        .exec(function (err, data) {
            var cartitem = data;
            if (!err) {
                Cart.findOne({})
                .exec(function(err, data){
                    if(!err) {
                        res.render('shop/cart', {
                            cartItem : cartitem,
                            cart: data,
                            title: 'Shopping Cart'
                        })
                    }
                })
                
            } else {
                res.render('shop/cart', {
                    msg: 'cart empty',
                    title: 'Shopping Cart',
                    error: err
                })
            }                 
        });
});

router.get('/add-to-cart/:id', function(req, res, next){
    var productId = req.params.id;
    CartItem.findOne({
        productId: productId
    })
    .exec(function(err, data){
        var cartitem = data;
        if(data == null){
            Product.findById({
                _id: productId
            })
            .exec(function(err, data){
                var product = data;
                if(!err) {
                    var item = new CartItem();
                    item.productId = productId;
                    item.quantity = 1;
                    item.price = product.price;
                    item.save(function(err, data){
                        if(!err) {
                            Cart.findOne({})
                                .exec(function(err, data){
                                    if(data == null) {
                                        var cart = new Cart();
                                        cart.cartItem.push(productId);
                                        cart.totalQty += 1
                                        cart.totalPrice += product.price;
                                        cart.save(function(err, data){
                                            if(!err) {
                                            res.redirect('/')
                                            }
                                        })
                                    } else {
                                        var qty = data.totalQty;
                                        qty++;
                                        var price = data.totalPrice;
                                        price += product.price;
                                        Cart.findByIdAndUpdate({
                                            _id: data._id
                                        },{
                                            $push: {
                                                'cartItem': productId
                                            },
                                            $set: {
                                                'totalQty': qty,
                                                'totalPrice': price
                                            }
                                        })
                                        .exec(function(err, data){
                                            if(!err) {
                                                res.redirect('/')
                                            }
                                        })
                                    }
                                })
                            
                        }
                    })
                }
            })
        } else {
            Product.findById({
                _id: productId
            })
            .exec(function(err, data){
                var product = data;
                var qty = cartitem.quantity;
                qty++;
                var price = cartitem.price;
                price += product.price;
                CartItem.findOneAndUpdate({
                    productId: productId
                },{
                    $set :{
                        quantity : qty,
                        price: price
                    }
                })
                .exec(function(err, data){
                    if(!err) {
                        Cart.findOne({})
                            .exec(function(err, data){
                                if(!err) {
                                    var cart = data;
                                    Product.findById({
                                        _id: productId
                                    })
                                    .exec(function(err, data){
                                        var qty = cart.totalQty;
                                        qty++;
                                        var price = cart.totalPrice;
                                        price += data.price;
                                        Cart.findByIdAndUpdate({
                                            _id: cart._id
                                        },{
                                            $set:{
                                                'totalQty': qty,
                                                'totalPrice': price
                                            }
                                        })
                                        .exec(function(err, data){
                                            if(!err) {
                                                res.redirect('/');
                                            }
                                        })
                                    })
                                    
                                }
                            })
                    }
                })
            })

        }
    })
    
});

router.get('/remove/:id', function(req, res, next){
    CartItem.findByIdAndRemove({
        _id: req.params.id
    })
    .exec(function(err, data){
        var c = data;
        if(!err) {
            var product = data;
            
            Cart.findOne({})
            .exec(function(err ,data) {
                if(!err) {
                    var qty = data.totalQty;
                    qty -= c.quantity;
                    var price = data.totalPrice;
                    price -= c.price;
                    Cart.findByIdAndUpdate({
                        _id: data._id
                    },{
                        $set: {
                            'totalPrice': price,
                            'totalQty': qty
                        }
                    })
                    .exec(function(err, data) {
                        if(!err) {
                            res.redirect('/cart');
                        }
                    })
                }
            })
        }
    })
})

router.get('/empty', function(req, res, next){
    CartItem.find({})
        .exec(function(err, data){
            if(data){
                CartItem.remove({}, function(err, data){
                    if(!err) {
                        Cart.remove({})
                        .exec(function(err, data){
                            if(!err) {
                                res.redirect('/cart');
                            }
                        })
                    }
                })
            }
        })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
