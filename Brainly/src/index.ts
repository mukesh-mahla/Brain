import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./Routes/route";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/", router);

async function startServer() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL!);

   
   

    app.listen(3000, () => {
      
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();
