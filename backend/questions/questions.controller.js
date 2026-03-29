//Imports
import express from "express";
import protectLogin from "../guard/protectLogin.guard.js";
import { submitAssessmentSchema } from "./questions.dto.js";
import {
  assessQuestions,
  getHistory,
  getSpecificHistory,
} from "./questions.service.js";
import { GDS15_QUESTIONS } from "./questions.constants.js";
//Config
const questionRouter = express.Router();
//Api-Routes
questionRouter.get("/", protectLogin, (req, res) => {
  const questions = GDS15_QUESTIONS;
  return res
    .status(200)
    .send({ message: "Question Provided!", success: true, data: questions });
});
questionRouter.get("/history/:id", protectLogin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).send({
        message: "Must provide id to extract info!",
        success: false,
        data: {},
      });
      throw new Error("Must provide the id to extract info!");
    }
    await getSpecificHistory(req, res, id);
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error!",
      success: false,
      data: {},
    });
    console.error("Detail Error:", error.message);
  }
});
questionRouter.get("/history", protectLogin, async (req, res) => {
  await getHistory(req, res);
});
questionRouter.post("/", protectLogin, async (req, res) => {
  try {
    const { error, value } = submitAssessmentSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).send({
        message: "Must match the request structure!",
        success: false,
        data: { errors: error.details },
      });
      return;
    }
    await assessQuestions(req, res, value);
  } catch (error) {
    if (!res.headersSent) {
      res
        .status(500)
        .send({ message: "Internal Server Error!", success: false, data: {} });
    }
    console.error("Assessment Error:", error.message);
  }
});
//Export
export default questionRouter;
