//Imports
import express from "express";
import { createUserSchema, loginUserSchema } from "./users.dto.js";
import {
  createUser,
  loginUser,
  fetchCurrentUser,
  logoutUser,
  checkUserExistsByIdentity,
} from "./users.service.js";
import protectLogin from "../guard/protectLogin.guard.js";
//Config
const userRouter = express.Router();
//Routes
userRouter.get("/", protectLogin, async (req, res) => {
  await fetchCurrentUser(req, res);
});
userRouter.post("/signup", async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).send({
        message: "Must provide valid data!",
        success: false,
        data: { errors: error.details },
      });
    }
    await createUser(req, res, value);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error!", success: false, data: {} });
    console.error("Internal Server Error!", error.message);
  }
});
userRouter.post("/login", async (req, res) => {
  try {
    const { error, value } = loginUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).send({
        message: "Must provide valid data!",
        success: false,
        data: { errors: error.details },
      });
    }
    await loginUser(req, res, value);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server Error!", success: false, data: {} });
    console.error("Internal Server Error!", error.message);
  }
});
userRouter.post("/exists", async (req, res) => {
  await checkUserExistsByIdentity(req, res);
});
userRouter.post("/logout", async (req, res) => {
  await logoutUser(req, res);
});
//Export
export default userRouter;
