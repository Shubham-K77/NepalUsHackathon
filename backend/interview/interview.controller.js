import express from "express";
import protectLogin from "../guard/protectLogin.guard.js";
import prisma from "../services/prisma.service.js";
import {
  createVapiAssistant,
  initiateWebCall,
  handleVapiWebhook,
} from "./interview.service.js";

const interviewRouter = express.Router();

interviewRouter.post("/setup", async (req, res) => {
  try {
    const assistant = await createVapiAssistant();
    return res.status(201).send({
      message: "Assistant created! Save the ID to .env as VAPI_ASSISTANT_ID",
      success: true,
      data: { assistantId: assistant.id },
    });
  } catch (error) {
    console.error("Setup error:", error.message);
    return res
      .status(500)
      .send({ message: "Assistant creation failed", success: false, data: {} });
  }
});

interviewRouter.post("/call", protectLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentId } = req.body;
    if (!assessmentId) {
      return res.status(400).send({
        message: "Assessment ID आवश्यक छ।",
        success: false,
        data: {},
      });
    }
    const result = await initiateWebCall(userId, assessmentId);
    return res.status(201).send({
      message: "कल सुरु भयो!",
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === "Call already exists for this assessment") {
      return res.status(409).send({
        message: "यो assessment को लागि कल पहिले नै भइसकेको छ।",
        success: false,
        data: {},
      });
    }
    if (error.message === "Assessment does not belong to this user") {
      return res.status(403).send({
        message: "यो assessment हेर्ने अनुमति छैन।",
        success: false,
        data: {},
      });
    }
    console.error("Call error:", error.message);
    return res
      .status(500)
      .send({ message: "कल सुरु गर्न सकिएन।", success: false, data: {} });
  }
});

interviewRouter.post("/webhook", async (req, res) => {
  res.status(200).send("ok");
  try {
    await handleVapiWebhook(req.body);
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    try {
      const message = req.body?.message ?? req.body;
      const vapiCallId = message?.call?.id;
      if (vapiCallId) {
        await prisma.vapiCall.update({
          where: { vapiCallId },
          data: { status: "failed" },
        });
      }
    } catch (_) {}
  }
});

interviewRouter.get("/call/:assessmentId", protectLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentId } = req.params;

    // Verify assessment belongs to user
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });
    if (!assessment) {
      return res
        .status(404)
        .send({ message: "मूल्यांकन फेला परेन।", success: false, data: {} });
    }
    if (assessment.userId !== userId) {
      return res
        .status(403)
        .send({
          message: "यो कल हेर्ने अनुमति छैन।",
          success: false,
          data: {},
        });
    }

    const vapiCall = await prisma.vapiCall.findUnique({
      where: { assessmentId },
      select: {
        status: true,
        summary: true,
        suggestions: true,
        crisisDetected: true,
        createdAt: true,
      },
    });
    if (!vapiCall) {
      return res
        .status(404)
        .send({ message: "कल फेला परेन।", success: false, data: {} });
    }
    return res.status(200).send({
      message: "Call Status Retrieved!",
      success: true,
      data: vapiCall,
    });
  } catch (error) {
    console.error("Call status error:", error.message);
    return res
      .status(500)
      .send({ message: "Internal Server Error!", success: false, data: {} });
  }
});

export default interviewRouter;
