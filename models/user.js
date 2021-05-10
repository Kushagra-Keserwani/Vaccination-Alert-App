var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    Email:String,
    Pincode: Number,
    Age: Number
});


module.exports = mongoose.model("User",UserSchema);
