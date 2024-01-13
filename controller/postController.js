const Post = require('../models/PostSchema');
const Topic = require('../models/TopicSchema');

const createPost = async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            text: req.body.text,
            date: Date.now()
        })
        console.log('successfully created topic ' + post?.title);
        res.json({ success: true, message: 'successfully created topic ' + post?.title});
    } catch (error) {
        res.json({success: false, message: 'error in creating topic' + error?.message});
        console.log('error in creating topic' + error?.message);
    }
}

const createAndAddPostToTopic = async (postTitle, postBody, topicId)=>{
    try {
        const post = await Post.create({
            title: postTitle,
            text: postBody,
            date: Date.now()
        })
        const postId = post._id;
        await Topic.updateOne({ _id: topicId }, { $push: { posts: postId } });
        console.log(`${postTitle} successfully added to topic ${topicId}`);
    } catch (error) {
        console.log({createAndAddPostToTopicError: error?.message});
    }
}

module.exports = {createPost, createAndAddPostToTopic};
