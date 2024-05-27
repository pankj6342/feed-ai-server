import express from 'express';
const router = express.Router();     
import postController from '../controller/postController.js';

router.post('/create', postController.createPost);
export default router;