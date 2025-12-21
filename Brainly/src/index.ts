import jwt from "jsonwebtoken";
import express from "express";
import { User,Link,Content,Tags } from "./db";
const app = express()
const router = express.Router();
export const JWT_USER_SECRET = "super@123"
import bcrypt, { hash } from "bcrypt"
import { userAuth } from "./middleware";
import mongoose from "mongoose";
import { randon } from "./utils";
import cookieParser from "cookie-parser"
import cors from "cors"

mongoose.connect("mongodb://127.0.0.1:27017/brainly").then(()=>{
  console.log("mongoose started")
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", 
  credentials: true }))
app.use('/',router)


router.post('/signup', async (req,res)=>{
  
    const {firstName,lastName,email,password}= req.body;

    const hashPassword = await bcrypt.hash(password,10);
   const user = await User.create({
    firstName,
    lastName,
    password:hashPassword,
    email
   })
 res.status(200).json({msg:"signup succesfully"})
})

router.post('/signin',async(req,res)=>{
    const {email,password} = req.body
  
   const user = await User.findOne({
    email:email
   })
   if(!user){
    res.json({msg:"user not found"})
    return 
   }
   const isMatched = await bcrypt.compare(password,user.password);
  
  if(user && isMatched){
    const token = jwt.sign({id:user._id},JWT_USER_SECRET);

    res.cookie("token",token,{httpOnly:true})
    res.json({msg:"signin success"})
  }else{
    res.status(403).json({msg:"token expire"})
  }
})

router.post('/addcontent',userAuth,async(req,res)=>{
 const {link,type,title} = req.body
 //@ts-ignore
const userId = req.userId
 const newContent= await Content.create({
  link,type,title,tags:[],userId
 })
 res.json({msg:"added succesfully"})

})

router.get('/document',userAuth,async(req,res)=>{
  //@ts-ignore
  const userId = req.userId
 const content = await Content.find({userId})

 res.json({content})
})

router.delete("/delete/:id",userAuth,async(req,res)=>{
  //@ts-ignore
  const userId = req.userId
  const id = req.params.id
if(!userId || !id){
  console.log("no user or content found")
  return
}
  const content =await Content.findOneAndDelete({userId,_id:id})

  res.json({msg:"deleted"})
})
router.post("/brain/share",userAuth,async(req,res)=>{
  const share = req.body.share
   if(share){
    const hash = randon(10)
   await Link.create({
      //@ts-ignore
      userId:req.userId,
      hash:hash
    })
   }else{
   await Link.deleteOne({
      //@ts-ignore
      userId:req.userId
    })
   }
   res.json({link:hash})
})

router.get("/brain/:shareLink",async(req,res)=>{
         const hash = req.params.shareLink
         const link = await Link.findOne({
              hash:hash
             })
   if(!link){
 res.status(411).json({msg:"sorry incorrect input"})
  return
      }
      const content = await Content.find({
        userId:link.userId
      })
      const user = await User.findOne({
        userId:link.userId
      })
     res.json({userName:user?.firstName,contents:content})
})

app.listen(3000,()=>console.log("server startde at 3000"))