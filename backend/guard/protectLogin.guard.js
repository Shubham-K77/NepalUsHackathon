//Imports
import jwt from "jsonwebtoken";
//Function
const protectLogin = async (req, res, next) => {
  try {
    //Check The Cookie
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return res.status(401).send({
        message: "Must login to continue!",
        success: false,
        data: {},
      });
    }
    //Verify Token (throws on invalid/expired)
    const userData = jwt.verify(access_token, process.env.JWT_SECRET);
    //Set Request Data
    req.user = userData;
    //Send Forward
    next();
  } catch (error) {
    //jwt.verify throws on invalid/expired token
    return res.status(401).send({
      message: "Token is expired or invalid!",
      success: false,
      data: {},
    });
  }
};
//Export
export default protectLogin;
