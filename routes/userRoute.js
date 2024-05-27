import express from "express";
const router = express.Router();
import userController from "../controller/userController.js";

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/confirmEmail", userController.confirmEmail);
router.post("/sendEmail", userController.emailSend);
router.get("/getPosts", userController.getAllPostsForUser);
router.get("/getUserData", userController.getUserData);
export default router;
