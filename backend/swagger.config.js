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
      },
    },
    security: [],
  },
  apis: ["./users/users.controller.js"],
};

const specs = swaggerJsdoc(options);
export default specs;
