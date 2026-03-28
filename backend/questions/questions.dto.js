//Imports:
import Joi from "joi";
//Schema:
export const submitAssessmentSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number().integer().min(1).max(15).required().messages({
          "number.base": "Question ID must be a number",
          "number.min": "Question ID must be between 1 and 15",
          "number.max": "Question ID must be between 1 and 15",
          "any.required": "Question ID is required",
        }),
        answer: Joi.string().valid("yes", "no").required().messages({
          "any.only": "Answer must be either 'yes' or 'no'",
          "any.required": "Answer is required",
        }),
      }),
    )
    .length(15)
    .required()
    .messages({
      "array.base": "Answers must be an array",
      "array.length": "All 15 questions must be answered",
      "any.required": "Answers are required",
    }),
});
