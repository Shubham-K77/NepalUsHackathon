//Imports
import jwt from "jsonwebtoken";
//Function
const protectLogin = async (req, res, next) => {
  try {
    //Check The Cookie
    const access_token = req.cookies.access_token;
    if (!access_token) {
      res
        .status(401)
        .send({ message: "Must login to continue!", success: false, data: {} });
      throw new Error("Must login to continue the request!");
    }
    //Validity Of Cookie
    const userData = jwt.verify(access_token, process.env.JWT_SECRET);
    if (!userData) {
      res.status(401).send({
        message: "Token is expired, Invalid Token Provided!",
        success: false,
        data: {},
      });
      throw new Error("Token is expired, Invalid Token Provided!");
    }
    //Set Request Data
    req.user = userData;
    //Send Forward
    next();
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error!", success: false, data: {} });
    console.error("Internal Server Error!", error.message);
  }
};
//Export
export default protectLogin;
