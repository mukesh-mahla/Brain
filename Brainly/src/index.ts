import dotenv from "dotenv"
dotenv.config()
import express from "express";
const app = express()

import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import cors from "cors"
import { router } from "./Routes/route";


mongoose.connect("mongodb://127.0.0.1:27017/brainly").then(()=>{
  console.log("mongoose started")
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", 
  credentials: true }))

app.use('/',router)


app.listen(3000,()=>console.log("server startde at 3000"))