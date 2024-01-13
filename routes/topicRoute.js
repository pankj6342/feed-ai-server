const express = require('express');
const router = express.Router();     
const topicController = require('../controller/topicController');

router.post('/create',topicController.createTopic);
router.post('/addpost',topicController.addPostToTopic);
router.post('/addsubscriber',topicController.addSubscriberToTopic);
router.post('/removesubscriber',topicController.removeSubscriberFromTopic);
router.get('/getAllTopics', topicController.getAllTopics);
module.exports = router;