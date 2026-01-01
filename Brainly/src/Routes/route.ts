import express, { RequestHandler} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { index } from '../vector';
import { getEmbedding } from '../embedding';
import { userAuth } from '../middleware';
import { Content, Link, User } from '../db';
import { buildContext, randon } from '../utils';
import { askGeminiStream } from './askGemini';

export const router = express.Router();
const JWT_USER_SECRET = process.env.JWT_USER_SECRET!;

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

const textForEmbedding = `
Title: ${title}
Type: ${type}
Link: ${link}
`;

const embedding = await getEmbedding(textForEmbedding);

await index.upsert([
  {
    id: newContent._id.toString(),
    values: embedding,
    metadata: {
      userId: userId.toString()
    }
  }
]);


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

 if (content) {
    await index.deleteOne(id); 
  }

  res.json({msg:"deleted"})
})
router.post("/brain/share",userAuth,async(req,res)=>{
  const share = req.body.share
  const hash = randon(10)
   if(share){
    
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

router.post("/reindex", userAuth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  
  const contents = await Content.find({ userId });
  

 
  for (const content of contents) {
    const textForEmbedding = `
this content is titled ${content.title}
type of content is ${content.type}
the Link is ${content.link}
This content is saved by the user for future reference.
`;

    const embedding = await getEmbedding(textForEmbedding);

    
    await index.upsert([
      {
        id: content._id.toString(),
        values: embedding,
        metadata: {
          userId: userId.toString()
        }
      }
    ]);
  }

  res.json({
    msg: "Reindex completed",
    total: contents.length
  });
});

router.post("/search", userAuth, async (req, res) => {
  const { query } = req.body;
  //@ts-ignore
  const userId = req.userId;

  const embedding = await getEmbedding(query);

  const result = await index.query({
    vector: embedding,
    topK: 5,
    filter: {
      userId: userId.toString()
    }
  });

  const ids = result.matches
    .filter(m => (m.score ?? 0) > 0.55)
    .map(m => m.id);

  const contents = await Content.find({
    _id: { $in: ids }
  });

  res.json({ contents });
});



router.post("/rag", userAuth, async (req: any, res: any) => {
  const { question } = req.body;
  // @ts-ignore
  const userId = req.userId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
 
  const queryEmbedding = await getEmbedding(question);

  
  const result = await index.query({
    vector: queryEmbedding,
    topK: 6,
    filter: {
      userId: userId.toString(),
    },
  });

  const ids = result.matches.map(m => m.id);


  const contents = await Content.find({
    _id: { $in: ids },
  });

  if (contents.length === 0) {
    return res.json({
      answer: "I couldn’t find anything related in your brain yet."
    });
  }

  
  const context = buildContext(contents);


  const prompt = `
You are an assistant helping a user recall knowledge from their saved content.

IMPORTANT:
- The context contains TITLES and LINKS of content the user saved.
- These are REFERENCES, not full explanations.
- You should infer explanations based on what these items are about.
- Use the context to ground your answer and avoid hallucination.
- if you can't summarize  it then atleast provide the links related to the question.

Context (saved content):
${context}

Question:
${question}

Rules:
- Base your answer on what the saved content implies.
- If NONE of the context is relevant, say:
  "I don't know based on your saved content."
- Be clear, concise, and helpful.
`;


for await (const chunk of askGeminiStream(prompt)) {
      res.write(`data: ${chunk}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();

 
});