//Import
import prisma from "../services/prisma.service.js";
import { generateSuggestions } from "../services/groq.service.js";
import { GDS15_QUESTIONS, calculateSeverity } from "./questions.constants.js";

//Functions
const assessQuestions = async (req, res, userInputInfo) => {
  try {
    const { answers } = userInputInfo;

    // Calculate score
    const score = answers.reduce((total, { questionId, answer }) => {
      const question = GDS15_QUESTIONS.find((q) => q.id === questionId);
      const point = question?.options[answer]?.score ?? 0;
      return total + point;
    }, 0);

    // Calculate severity
    const severity = calculateSeverity(score);

    // Convert answers to boolean array (true if depressive answer)
    const booleanAnswers = answers
      .sort((a, b) => a.questionId - b.questionId)
      .map(({ questionId, answer }) => {
        const question = GDS15_QUESTIONS.find((q) => q.id === questionId);
        return answer === question?.depressiveAnswer;
      });

    const userId = req.user.id;

    // Create assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        answers: booleanAnswers,
        score,
        severity,
      },
    });

    if (!assessment) {
      res.status(500).send({
        message: "Unable to create the assessment!",
        success: false,
        data: {},
      });
      throw new Error("Unable to create the assessment!");
    }

    // Fetch user details (no language field)
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        dob: true,
        gender: true,
        district: true,
        province: true,
        pinHash: false,
      },
    });

    if (!user) {
      res.status(404).send({
        message: "User wasn't found in the system!",
        success: false,
        data: {},
      });
      throw new Error("User wasn't found in the system!");
    }

    // Generate AI suggestions
    const suggestions = await generateSuggestions(
      user,
      assessment.score,
      assessment.severity,
    );

    // Create feedback record with suggestions
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        assessmentId: assessment.id,
        suggestions,
        comment: null,
      },
    });

    if (!feedback) {
      res.status(500).send({
        message: "Unable to create the feedback!",
        success: false,
        data: {},
      });
      throw new Error("Unable to create the feedback!");
    }

    return res.status(201).json({
      success: true,
      message: "Successfully Created!",
      data: {
        assessmentInfo: assessment,
        feedbackInfo: feedback,
      },
    });
  } catch (error) {
    if (!res.headersSent) {
      res
        .status(500)
        .send({ message: "Internal Server Error!", success: false, data: {} });
    }
    console.error("Assessment Error:", error.message);
    throw error;
  }
};

//Export
export { assessQuestions };
