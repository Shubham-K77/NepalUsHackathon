//Imports
import prisma from "../services/prisma.service.js";
import { districtNames, provinceNames, genderNames } from "../const.values.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//Functions
const createUser = async (req, res, userInfo) => {
  const userExists = await prisma.userModule.findUnique({
    where: {
      name_dob: {
        name: userInfo.name,
        dob: userInfo.dob,
      },
    },
  });
  if (userExists) {
    return res.status(401).send({
      message: "Provided info already exist in the system! Try logging in!",
      success: false,
      data: {},
    });
  }
  //Hash The Pin
  const salt = await bcrypt.genSalt(15);
  const pinHash = await bcrypt.hash(userInfo.pin, salt);
  //Create New User
  const newUser = await prisma.userModule.create({
    data: {
      name: userInfo.name,
      dob: userInfo.dob,
      gender: userInfo.gender,
      genderNe: genderNames[userInfo.gender].ne,
      district: userInfo.district,
      districtNe: districtNames[userInfo.district].ne,
      province: userInfo.province,
      provinceNe: provinceNames[userInfo.province].ne,
      pinHash,
      updatedAt: new Date(),
    },
  });
  if (!newUser) {
    return res.status(500).send({
      message: "Failed To Create New User!",
      success: false,
      data: {},
    });
  }
  //Set The Token
  const payload = {
    id: newUser.id,
    name: newUser.name,
    dob: newUser.dob,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });
  //Set The Cookie, Direct Login For First Time
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000, //3-days
  });
  //Response
  return res
    .status(201)
    .send({ message: "Successfully Registered!", success: true, data: {} });
};
const loginUser = async (req, res, loginInfo) => {
  //Check User
  const userExists = await prisma.userModule.findUnique({
    where: {
      name_dob: {
        name: loginInfo.name,
        dob: loginInfo.dob,
      },
    },
  });
  if (!userExists) {
    return res.status(404).send({
      message: "Provided user wasn't found in the system!",
      success: false,
      data: {},
    });
  }
  //Check Pin
  const isPasswordValid = await bcrypt.compare(
    loginInfo.pin,
    userExists.pinHash,
  );
  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Provided pin was incorrect!",
      success: false,
      data: {},
    });
  }
  //Create token
  const payload = {
    id: userExists.id,
    name: userExists.name,
    dob: userExists.dob,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });
  //Set Cookie
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000, //3-days
  });
  //Response
  return res
    .status(200)
    .send({ message: "Successfully Verified!", success: true, data: {} });
};
const fetchCurrentUser = async (req, res) => {
  try {
    //Get User Data:
    const userData = req.user;
    if (!userData) {
      return res.status(401).send({
        message: "Must login to continue the request!",
        success: false,
        data: {},
      });
    }
    //Fetch Data From DB
    const userExists = await prisma.userModule.findUnique({
      where: {
        id: userData.id,
      },
      omit: {
        pinHash: true,
      },
    });
    if (!userExists) {
      return res.status(404).send({
        message: "The provided user wasn't found in the system!",
        success: false,
        data: {},
      });
    }
    //Return
    return res.status(200).send({
      message: "Successfully Retrieved!",
      success: true,
      data: userExists,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error!", success: false, data: {} });
    console.error("Internal Server Error!", error.message);
  }
};
const logoutUser = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).send({
    message: "Successfully Logged Out!",
    success: true,
    data: {},
  });
};

const checkUserExistsByIdentity = async (req, res) => {
  try {
    const { name, dob } = req.body || {};

    if (!name || !dob) {
      return res.status(400).send({
        message: "Name and dob are required",
        success: false,
        data: {},
      });
    }

    const user = await prisma.userModule.findUnique({
      where: {
        name_dob: {
          name,
          dob,
        },
      },
      select: { id: true },
    });

    return res.status(200).send({
      message: "User existence checked",
      success: true,
      data: { exists: Boolean(user) },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error!",
      success: false,
      data: {},
    });
  }
};
//Exports
export {
  createUser,
  loginUser,
  fetchCurrentUser,
  logoutUser,
  checkUserExistsByIdentity,
};
