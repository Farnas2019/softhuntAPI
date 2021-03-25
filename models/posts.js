const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    postT:{
        type: String,
    },
    postC:{
        type: String,
    },
    discription:{
        type: String,
    },
    spec:{
        type: Array,
    },
    image1:{
        type: String,
    },
    image2:{
        type: String,
    },
    image3:{
        type: String,
    },
    image4:{
        type: String,
    },
    image5:{
        type: String,
    },
    vid:{
        type: String,
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, {timestamps: true});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;