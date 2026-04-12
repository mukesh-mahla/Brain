import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./Routes/route.js";
import { prisma} from "./db.js";

const app = express();


app.use(cors({ origin: ["https://brain-three-sage.vercel.app"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", router);

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();