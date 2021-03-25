const mongoose = require("mongoose");
const passportMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    username:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    },
}, {timestamps:true});
userSchema.plugin(passportMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;