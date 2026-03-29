import express from "express";
import protectLogin from "../guard/protectLogin.guard.js";
import prisma from "../services/prisma.service.js";
import {
  createVapiAssistant,
  getInterviewStartConfig,
  linkVapiCallByAssessment,
  completeInterviewFromClient,
  initiateWebCall,
  handleVapiWebhook,
} from "./interview.service.js";

const interviewRouter = express.Router();

interviewRouter.get("/start/:assessmentId", protectLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentId } = req.params;
    const config = await getInterviewStartConfig(userId, assessmentId);
    return res.status(200).send({
      message: "Interview config generated",
      success: true,
      data: config,
    });
  } catch (error) {
    if (error.message === "Assessment not found") {
      return res
        .status(404)
        .send({ success: false, message: "मूल्यांकन फेला परेन।", data: {} });
    }
    if (error.message === "Assessment does not belong to this user") {
      return res
        .status(403)
        .send({
          success: false,
          message: "यो assessment हेर्ने अनुमति छैन।",
          data: {},
        });
    }
    if (error.message.startsWith("VAPI config missing:")) {
      return res
        .status(503)
        .send({
          success: false,
          message: "फोन साथी सेवा अहिले तयार छैन।",
          data: { reason: error.message },
        });
    }
    return res
      .status(500)
      .send({
        success: false,
        message: "Config generate गर्न सकिएन।",
        data: { reason: error.message },
      });
  }
});

interviewRouter.post("/link/:assessmentId", protectLogin, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentId } = req.params;
    const { vapiCallId } = req.body || {};

    if (!vapiCallId) {
      return res
        .status(400)
        .send({ success: false, message: "vapiCallId आवश्यक छ।", data: {} });
    }

    const result = await linkVapiCallByAssessment(
      userId,
      assessmentId,
      vapiCallId,
    );
    return res
      .status(200)
      .send({ success: true, message: "Call linked", data: result });
  } catch (error) {
    if (error.message === "Assessment not found") {
      return res
        .status(404)
        .send({ success: false, message: "मूल्यांकन फेला परेन।", data: {} });
    }
    if (error.message === "Assessment does not belong to this user") {
      return res
        .status(403)
        .send({
          success: false,
          message: "यो assessment हेर्ने अनुमति छैन।",
          data: {},
        });
    }
    return res
      .status(500)
      .send({
        success: false,
        message: "Call link गर्न सकिएन।",
        data: { reason: error.message },
      });
  }
});

interviewRouter.post(
  "/complete/:assessmentId",
  protectLogin,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { assessmentId } = req.params;
      const result = await completeInterviewFromClient(
        userId,
        assessmentId,
        req.body || {},
      );
      return res
        .status(200)
        .send({
          success: true,
          message: "Client completion stored",
          data: result,
        });
    } catch (error) {
      if (error.message === "Assessment not found") {
        return res
          .status(404)
          .send({ success: false, message: "मूल्यांकन फेला परेन।", data: {} });
      }
      if (error.message === "Assessment does not belong to this user") {
        return res
          .status(403)
          .send({
            success: false,
            message: "यो assessment हेर्ने अनुमति छैन।",
            data: {},
          });
      }
      if (error.message === "vapiCallId is required for client completion") {
        return res
          .status(400)
          .send({ success: false, message: "vapiCallId आवश्यक छ।", data: {} });
      }
      return res
        .status(500)
        .send({
          success: false,
          message: "Call completion save गर्न सकिएन।",
          data: { reason: error.message },
        });
    }
  },
);

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
    return res.status(500).send({
      message: "Assistant creation failed",
      success: false,
      data: { reason: error.message },
    });
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
    if (error.message === "Assessment not found") {
      return res.status(404).send({
        message: "मूल्यांकन फेला परेन।",
        success: false,
        data: {},
      });
    }
    if (error.message.startsWith("VAPI config missing:")) {
      return res.status(503).send({
        message: "फोन साथी सेवा अहिले तयार छैन।",
        success: false,
        data: { reason: error.message },
      });
    }
    if (error.message.startsWith("Vapi web call failed with status")) {
      return res.status(502).send({
        message: "फोन साथी सेवा अहिले उपलब्ध छैन।",
        success: false,
        data: { reason: error.message },
      });
    }
    console.error("Call error:", error.message);
    return res.status(500).send({
      message: "कल सुरु गर्न सकिएन।",
      success: false,
      data: { reason: error.message },
    });
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
      return res.status(403).send({
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
      return res.status(200).send({
        message: "कल सुरु भएको छैन।",
        success: true,
        data: null,
      });
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
