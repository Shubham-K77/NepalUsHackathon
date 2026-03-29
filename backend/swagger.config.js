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
        ApiResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Successfully Retrieved!" },
            success: { type: "boolean", example: true },
            data: { type: "object" },
          },
        },
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
              enum: ["normal", "moderate", "severe"],
              description: "Depression severity level",
              example: "moderate",
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
        InterviewCallRequest: {
          type: "object",
          required: ["assessmentId"],
          properties: {
            assessmentId: {
              type: "string",
              description: "Assessment UUID",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
          },
        },
        InterviewCallStatus: {
          type: "object",
          properties: {
            status: { type: "string", example: "completed" },
            summary: { type: "string", nullable: true },
            suggestions: { type: "object", nullable: true },
            crisisDetected: { type: "boolean", example: false },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-29T10:30:00Z",
            },
          },
        },
      },
    },
    paths: {
      "/api/v1/users/signup": {
        post: {
          tags: ["Users"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "User registered",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            400: { description: "Validation error" },
            401: { description: "User already exists" },
          },
        },
      },
      "/api/v1/users/login": {
        post: {
          tags: ["Users"],
          summary: "Login with name, dob and pin",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            400: { description: "Validation error" },
            401: { description: "Invalid pin" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/v1/users/": {
        get: {
          tags: ["Users"],
          summary: "Get current logged-in user",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "User retrieved",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          data: { $ref: "#/components/schemas/User" },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/v1/questions/": {
        get: {
          tags: ["Questions"],
          summary: "Get all GDS-15 questions",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Questions retrieved",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Question" },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          tags: ["Questions"],
          summary: "Submit GDS-15 answers and create assessment",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SubmitAssessmentRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Assessment submitted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
            500: { description: "Server error" },
          },
        },
      },
      "/api/v1/questions/history": {
        get: {
          tags: ["Questions"],
          summary: "Get assessment history for current user",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "History retrieved",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/v1/questions/history/{id}": {
        get: {
          tags: ["Questions"],
          summary: "Get a specific assessment by id",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Assessment UUID",
            },
          ],
          responses: {
            200: {
              description: "Assessment retrieved",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
      "/api/v1/interviews/setup": {
        post: {
          tags: ["Interviews"],
          summary: "Create VAPI assistant",
          responses: {
            201: {
              description: "Assistant created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            500: { description: "Assistant creation failed" },
          },
        },
      },
      "/api/v1/interviews/call": {
        post: {
          tags: ["Interviews"],
          summary: "Initiate interview call for an assessment",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InterviewCallRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Call initiated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiResponse" },
                },
              },
            },
            400: { description: "Missing assessmentId" },
            403: { description: "Forbidden" },
            409: { description: "Duplicate call" },
            500: { description: "Call initiation failed" },
          },
        },
      },
      "/api/v1/interviews/webhook": {
        post: {
          tags: ["Interviews"],
          summary: "VAPI webhook callback",
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true },
              },
            },
          },
          responses: {
            200: {
              description: "Webhook accepted",
              content: {
                "text/plain": {
                  schema: { type: "string", example: "ok" },
                },
              },
            },
          },
        },
      },
      "/api/v1/interviews/call/{assessmentId}": {
        get: {
          tags: ["Interviews"],
          summary: "Get interview call status by assessment id",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "assessmentId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Assessment UUID",
            },
          ],
          responses: {
            200: {
              description: "Call status retrieved",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        type: "object",
                        properties: {
                          data: {
                            $ref: "#/components/schemas/InterviewCallStatus",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            403: { description: "Forbidden" },
            404: { description: "Not found" },
          },
        },
      },
    },
    security: [],
  },
  apis: [
    "./users/users.controller.js",
    "./questions/questions.controller.js",
    "./interview/interview.controller.js",
  ],
};

const specs = swaggerJsdoc(options);
export default specs;
