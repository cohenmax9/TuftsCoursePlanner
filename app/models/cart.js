// app/models/user.js

// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    courses : Array
});

module.exports = mongoose.model("Cart", userSchema);