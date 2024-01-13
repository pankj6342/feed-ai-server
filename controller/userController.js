const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const fetchuser = require("../middleware/fetchuser");
const Topic = require("../models/TopicSchema");
const Post = require("../models/PostSchema");

const JWT_SECRET = "JWT_$ECRET_$TRING";

const signup = async (req, res) => {
  let success = false;
  //check whether a user already exists:
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ success, error: "User with this email already exists" });
    }
    //hashing of password:
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    const otpcode = Math.floor(Math.random() * 10000 + 1);
    const expireIn = new Date().getTime() + 300 * 1000; //5 minutes from now

    success = true;
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    // console.log("user:",user);
    //JWT Authentication:
    const data = {
      user: {
        id: user.id,
      },
    };
    //send a mail with otp:
    console.log("calling");
    //   emailSend(user.email,user.otpData.otpcode);
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success, user, authToken });
  } catch (e) {
    success = false;
    console.log(e.message);
    res.status(500).json({ success, error: "Some Error Occured" });
  }
};

const emailSend = async (req, res) => {};
//   try{
//     // console.log("emailSend called");
//     // console.log("req: ",req.body);
//     let user =await User.findOne({"email":req.body.email})
//     const OTP=user?.otpData?.otpcode || "1234";

//     var transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true, // true for 465, false for other ports
//       auth: {
//         user: 'pankj6342@gmail.com', // generated ethereal user
//         pass: `${"psb2401"}!`, // generated ethereal password
//       },
//     });
//     // send mail with defined transport object
//     var info = await transporter.sendMail({
//       from: 'psbhardwaj.psb@hotmail.com', // sender address
//       to: req.body.email, // list of receivers
//       subject: "Please verify your email", // Subject line
//       text: "pankaj", // plain text body
//       html:
//       `<div>
//       <h2>Enter Otp to verify</h2>
//       <hr/>
//       <p>
//       The secret opt for your account with email: ${req.body.email} is: <strong>${OTP}</strong>
//       </p>
//       </div>`, // html body
//     });
//     var success=true;
//     res.json({success,message:"Email Sent Successfully!!"});
//     console.log("Message sent: %s", info.messageId);
//   }catch(e){
//     success=false;
//     res.json({success,message:e.message});
//     console.log(e);
//   }
//   }

const confirmEmail = async (req, res) => {
  success = true;
  res.json({ success, message: "Sign Up successfully" });
  // let success=false;
  // const user= await User.findOne({email:req.body.email});
  // const diff= user.otpData.expireIn - (new Date().getTime());
  // if(diff<0){
  //     res.status(500).json({success,message:"OPT expired"});
  // }
  // else{
  //     if(user.otpData.otpcode!=req.body.otp){
  //         res.status(500).json({success,message:"Invalid OTP"});
  //     }
  //     else{
  //         success=true;
  //         res.json({success,message:"Sign Up successfully"});
  //     }
  // }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      //user doesn't exists
      return res
        .status(400)
        .json({ success, error: "Please Enter Valid Email/ Password" });
    }

    //compare the hashes of password entered by user and the password stored in the database
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      //if password is incorrect
      return res
        .status(400)
        .json({ success, error: "Please Enter Valid Email/ Password" });
    }

    //if password is correct
    success = true;
    const data = { user: { id: user.id } };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ success, authtoken });
  } catch (e) {
    success = false;
    console.log(e.message);
    res.status(500).json({ success, error: "Some Error Occured" });
  }
};

const getAllPostsForUser = async (req, res) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Invalid Token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user=data.user;
    const {subscriptions} = await User.findById(req.user.id);
    let userPosts = {};
    for(const topicId of subscriptions){
      const {posts, title} = await Topic.findById(topicId);
      userPosts[title] = {posts: []};
      for(const postId of posts){
          const postData = await Post.findById(postId);
          userPosts[title].posts.push(postData);
      }
    }
    return res.status(200).json({success: true, userPosts});
  } catch (e) {
    return res.status(500).json({success: false, error: e?.message});
  }
}

const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.json({success: true, user});
  } catch (error) {
    res.json({success: false, error: error?.message})
  }
}

module.exports = { signup, confirmEmail, login, emailSend, getAllPostsForUser, getUserData};
