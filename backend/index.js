//Imports
import dotenv from "dotenv";
dotenv.config(); // Must be first, before any other imports

import express from "express";
import cors from "cors";
import cookie from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger.config.js";
import { connect } from "./services/prisma.service.js";
import router from "./routes/index.js";
const app = express();
app.use(express.json());
app.use(cookie());

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (Postman/curl) with no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//Swagger Documentation
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(specs, { explorer: true }));

app.use("/", router);
//Init Express
app.listen(process.env.PORT || 3001, async () => {
  console.log(`App is running on port: 3001`);
  await connect();
  console.log("Successfully connected with PostgreSql [Supabase]");
});
//Export
export default app;
