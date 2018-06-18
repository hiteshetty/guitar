var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var categories = mongoose.Schema({
    name:{
        type: String,
    },
});
module.exports = mongoose.model('categories', categories);