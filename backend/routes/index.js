//Imports
import express from "express";
import userRouter from "../users/users.controller.js";
//Config
const router = express.Router();
//Routing
router.use("/api/v1/users", userRouter);
//Export
export default router;
