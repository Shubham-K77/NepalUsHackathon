import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nepal US Hackathon - GDS Assessment API",
      version: "1.0.0",
      description:
        "Backend API for GDS-15 Depression Assessment and AI-based Feedback System",
      contact: {
        name: "Development Team",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3001",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description: "JWT Token stored in httpOnly cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique user identifier (UUID)",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            name: {
              type: "string",
              description: "User name (2-50 characters)",
              example: "Raj Kumar",
            },
            dob: {
              type: "string",
              format: "date-time",
              description: "Date of birth in ISO format",
              example: "1990-05-15T00:00:00Z",
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE", "OTHER"],
              description: "User gender",
              example: "MALE",
            },
            genderNe: {
              type: "string",
              description: "Gender in Nepali (Optional)",
              example: "पुरुष",
            },
            district: {
              type: "string",
              description: "District code from Nepal",
              example: "KATHMANDU",
            },
            districtNe: {
              type: "string",
              description: "District name in Nepali",
              example: "काठमाडौं",
            },
            province: {
              type: "string",
              description: "Province code from Nepal",
              example: "BAGMATI",
            },
            provinceNe: {
              type: "string",
              description: "Province name in Nepali",
              example: "बागमती",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
              example: "2026-03-28T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2026-03-28T10:30:00Z",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["name", "dob", "gender", "district", "province", "pin"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 50,
              example: "Raj Kumar",
            },
            dob: {
              type: "string",
              format: "date",
              description: "Date in ISO format (YYYY-MM-DD)",
              example: "1990-05-15",
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE", "OTHER"],
              example: "MALE",
            },
            district: {
              type: "string",
              example: "KATHMANDU",
            },
            province: {
              type: "string",
              example: "BAGMATI",
            },
            pin: {
              type: "string",
              pattern: "^[0-9]{4}$",
              description: "4-digit numeric PIN",
              example: "1234",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["name", "dob", "pin"],
          properties: {
            name: {
              type: "string",
              example: "Raj Kumar",
            },
            dob: {
              type: "string",
              format: "date",
              description: "Date in ISO format (YYYY-MM-DD)",
              example: "1990-05-15",
            },
            pin: {
              type: "string",
              pattern: "^[0-9]{4}$",
              description: "4-digit numeric PIN",
              example: "1234",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Successfully Registered!",
            },
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              example: {},
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error message",
            },
            success: {
              type: "boolean",
              example: false,
            },
            data: {
              type: "object",
              example: {},
            },
          },
        },
        Question: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Question number (1-15)",
              example: 1,
            },
            question: {
              type: "string",
              description: "Question text in Nepali",
              example: "के तपाईं आफ्नो जीवनसँग सन्तुष्ट हुनुहुन्छ?",
            },
            options: {
              type: "object",
              properties: {
                yes: {
                  type: "object",
                  properties: {
                    label: { type: "string", example: "हो" },
                    score: { type: "integer", example: 0 },
                  },
                },
                no: {
                  type: "object",
                  properties: {
                    label: { type: "string", example: "होइन" },
                    score: { type: "integer", example: 1 },
                  },
                },
              },
            },
            depressiveAnswer: {
              type: "string",
              enum: ["yes", "no"],
              description: "The answer indicating depression",
              example: "no",
            },
          },
        },
        SubmitAssessmentRequest: {
          type: "object",
          required: ["answers"],
          properties: {
            answers: {
              type: "array",
              minItems: 15,
              maxItems: 15,
              description: "Array of 15 question answers (Q1-Q15)",
              items: {
                type: "object",
                required: ["questionId", "answer"],
                properties: {
                  questionId: {
                    type: "integer",
                    minimum: 1,
                    maximum: 15,
                    description: "Question ID (1-15)",
                    example: 1,
                  },
                  answer: {
                    type: "string",
                    enum: ["yes", "no"],
                    description: "User's answer",
                    example: "yes",
                  },
                },
              },
            },
          },
        },
        Assessment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Assessment ID (UUID)",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            userId: {
              type: "string",
              description: "Associated user ID",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            answers: {
              type: "array",
              description: "15 boolean answers (true if depressive answer)",
              items: { type: "boolean" },
              example: [
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
                false,
                true,
              ],
            },
            score: {
              type: "integer",
              minimum: 0,
              maximum: 15,
              description: "Total score (0-15)",
              example: 8,
            },
            severity: {
              type: "string",
              enum: ["normal", "mild", "moderate", "severe"],
              description: "Depression severity level",
              example: "mild",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Assessment creation timestamp",
              example: "2026-03-28T10:30:00Z",
            },
          },
        },
        Feedback: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Feedback ID",
              example: "feedback-uuid",
            },
            userId: {
              type: "string",
              description: "Associated user ID",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            assessmentId: {
              type: "string",
              description: "Associated assessment ID",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            suggestions: {
              type: "object",
              description: "AI-generated suggestions",
              properties: {
                message: {
                  type: "string",
                  description: "Message in Nepali",
                },
                activities: { type: "array" },
                resources: { type: "array" },
                helplines: { type: "array" },
                emergency: { type: "string" },
              },
            },
            comment: {
              type: "string",
              description: "Optional user comment",
              nullable: true,
            },
          },
        },
      },
    },
    security: [],
  },
  apis: ["./users/users.controller.js", "./questions/questions.controller.js"],
};

const specs = swaggerJsdoc(options);
export default specs;
