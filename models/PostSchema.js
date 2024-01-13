const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema ({
    title: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now}
})

const Post = mongoose.model('post',PostSchema);

module.exports = Post;