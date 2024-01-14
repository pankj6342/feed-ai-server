const Topic = require("../models/TopicSchema");
const User = require("../models/UserSchema");

const createTopic = async (req, res) => {
  try {
    const topic = await Topic.create({
      title: req.body.title,
      description: req.body.description,
      posts: [],
      subscribers: [],
    });
    console.log("successfully created topic " + topic?.title);
    return res.json({
      success: true,
      message: "successfully created topic " + topic?.title,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "error in creating topic" + error?.message,
    });
    console.log("error in creating topic" + error?.message);
  }
};

const addPostToTopic = async (req, res) => {
  try {
    const topicId = req.body.topicId;
    const postId = req.body.postId;
    if (!topicId || !postId)
      return res.json({ success: false, message: `Invalid topicId/postId` });
    await Topic.updateOne({ _id: topicId }, { $push: { posts: postId } });
    console.log(`Post ${postId} added to topic ${topicId}`);
    return res.json({
      success: true,
      message: `Post ${postId} added to topic ${topicId}`,
    });
  } catch (error) {
    console.log({ sucess: false, message: error?.message });
  }
};

const addSubscriberToTopic = async (req, res) => {
  try {
    const { topicId, userId } = req.body;
    if (!topicId || !userId)
      return res.json({ sucess: false, message: "Invalid topicId/subscriberId" });
    const {name, email} = await User.findById(userId);
    await Topic.updateOne({ _id: topicId }, { $push: { subscribers: {userId, name, email} } });
    await User.updateOne(
      { _id: userId },
      { $push: { subscriptions: topicId } }
    );

    // console.log(`User ${userId} added to topic ${topicId}`);
    return res.json({
      success: true,
      message: `User ${userId} added to topic ${topicId}`,
    });
  } catch (error) {
   return res.json({
      sucess: false,
      message: "Error in adding subscriber: " + error?.message,
    });
    // console.log("Error in adding subscriber: " + error?.message);
  }
};

const removeSubscriberFromTopic = async (req, res) => {
  try {
    const { topicId, userId } = req.body;
    if (!topicId || !userId)
      return res.json({ sucess: false, message: "Invalid topicId/subscriberId" });
    await Topic.updateOne({ _id: topicId }, { $pull: { subscribers: { userId: userId } } });
    await User.updateOne({ _id: userId }, { $pull: { subscriptions: topicId } });
    
    console.log(`User ${userId} removed from topic ${topicId}`);
    return res.json({
      success: true,
      message: `User ${userId} removed from topic ${topicId}`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in removing subscriber\n" + error?.message,
    });
    console.log("Error in removing subscriber\n" + error?.message);
  }
};

const getAllTopics = async(req, res) => {
  try {
    const topics = await Topic.find({});
    res.send({success: true, topics});
  } catch (error) {
    res.send({success: false, error: error.message});
  }
}

module.exports = {createTopic, addPostToTopic, addSubscriberToTopic, removeSubscriberFromTopic, getAllTopics}
