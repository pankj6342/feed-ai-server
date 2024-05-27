import express from 'express';
const router = express.Router();     
import topicController from '../controller/topicController.js';

router.post('/create',topicController.createTopic);
router.post('/addpost',topicController.addPostToTopic);
router.post('/addsubscriber',topicController.addSubscriberToTopic);
router.post('/removesubscriber',topicController.removeSubscriberFromTopic);
router.get('/getAllTopics', topicController.getAllTopics);
export default router;