const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    caption: {
        type: String,
        trim: true,
        maxlength: 2000
    },
    image: {
        type: String
    },
    category:{
        type: String,
        enum:['fashion','skincare', 'lifestyle', 'hobbies']
    },
    likes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
},{timestamps: true})


const Post = mongoose.model('Post', postSchema)

module.exports = Post