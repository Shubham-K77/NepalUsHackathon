//Imports
import express from "express";
import userRouter from "../users/users.controller.js";
import questionRouter from "../questions/questions.controller.js";
import interviewRouter from "../interview/interview.controller.js";
//Config
const router = express.Router();
//Routing
router.use("/api/v1/users", userRouter);
router.use("/api/v1/questions", questionRouter);
router.use("/api/v1/interviews", interviewRouter);
//Export
export default router;
