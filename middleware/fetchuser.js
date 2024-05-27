import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
const JWT_SECRET = "JWT_$ECRET_$TRING";

const fetchuser = (req, res, next) => {
  //next refer=> next function written after middleware func. i.e. callback function //
  //get auth token from header of the request
  //we need to explicitly pass this token in header named 'auth-token'
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "Invalid Token" });
  }
  try {
    //jwt.verify will return the user JSON if the token is matched
    //TODO: change this JWT_SECRET to environment variable.
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;

    next(); 
  } catch (error) {
    //if the token is invalid
    res.status(401).send({ error: "Invalid Token" });
  }
};

module.exports = fetchuser;
