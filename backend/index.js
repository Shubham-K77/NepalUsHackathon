//Imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookie from "cookie-parser";
import { connect } from "./services/prisma.service.js";
import router from "./routes/index.js";
//Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookie());
app.use(cors());
app.use("/", router);
//Init Express
app.listen(process.env.PORT || 3001, async () => {
  console.log(`App is running on port: 3001`);
  await connect();
  console.log("Successfully connected with PostgreSql [Supabase]");
});
//Export
export default app;
