import express, { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { index } from '../vector.js';
import { getEmbedding } from '../embedding.js';
import { userAuth } from '../middleware.js';
import { buildContext, randon, system_prompt } from '../utils.js';
import { askGeminiStream } from './askGemini.js';
import {prisma} from "../db.js"

export const router = express.Router();
const JWT_USER_SECRET = process.env.JWT_USER_SECRET!;


router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      password: hashPassword,
      email,
    },
  });

  res.status(200).json({ msg: 'signup succesfully' });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.json({ msg: 'user not found' });
    return;
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (user && isMatched) {
    const token = jwt.sign({ id: user.id }, JWT_USER_SECRET);
    res.cookie('token', token, { httpOnly: true,secure:true,sameSite:"none" });
    res.json({ msg: 'signin success' });
  } else {
    res.status(403).json({ msg: 'token expire' });
  }
});

router.post('/addcontent', userAuth, async (req, res) => {
  const { link, type, title, tags, summary } = req.body;
  // @ts-ignore
  const userId = req.userId;

  const newContent = await prisma.content.create({
    data: {
      link,
      type,
      title,
      tags:tags || [],
      summary:summary || "",
      userId,
    },
  });

  const textForEmbedding = `
Title: ${title}
Type: ${type}
Link: ${link}
tags: ${(tags || []).join(', ')}
summary: ${summary}
`;

  const embedding = await getEmbedding(textForEmbedding);

  await index.upsert([
    {
      id: newContent.id,
      values: embedding,
      metadata: {
        userId: userId.toString(),
      },
    },
  ]);

  res.json({ msg: 'added succesfully' });
});

router.get('/document', userAuth, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;

  const content = await prisma.content.findMany({
    where: { userId },
  });

  res.json({ content });
});

router.delete('/delete/:id', userAuth, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const id = req.params.id;

  if (!userId || !id) {
    console.log('no user or content found');
    return;
  }

  const content = await prisma.content.deleteMany({
    where: { userId, id },
  });

  if (content.count > 0) {
    await index.deleteOne(id);
  }

  res.json({ msg: 'deleted' });
});

router.post('/brain/share', userAuth, async (req, res) => {
  const share = req.body.share;
  const hash = randon(10);

  if (share) {
    await prisma.link.create({
      data: {
        // @ts-ignore
        userId: req.userId,
        hash,
      },
    });
  } else {
    await prisma.link.deleteMany({
      // @ts-ignore
      where: { userId: req.userId },
    });
  }

  res.json({ link: hash });
});

router.get('/brain/:shareLink', async (req, res) => {
  const hash = req.params.shareLink;

  const link = await prisma.link.findFirst({
    where: { hash },
  });

  if (!link) {
    res.status(411).json({ msg: 'sorry incorrect input' });
    return;
  }

  const content = await prisma.content.findMany({
    where: { userId: link.userId },
  });

  const user = await prisma.user.findUnique({
    where: { id: link.userId },
  });

  res.json({ userName: user?.firstName, contents: content });
});

router.post('/reindex', userAuth, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;

  const contents = await prisma.content.findMany({
    where: { userId },
  });

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
        id: content.id,
        values: embedding,
        metadata: {
          userId: userId.toString(),
        },
      },
    ]);
  }

  res.json({ msg: 'Reindex completed', total: contents.length });
});

router.post('/search', userAuth, async (req, res) => {
  const { query } = req.body;
  // @ts-ignore
  const userId = req.userId;

  const embedding = await getEmbedding(query);

  const result = await index.query({
    vector: embedding,
    topK: 5,
    filter: { userId: userId.toString() },
  });

  const ids = result.matches
    .filter((m) => (m.score ?? 0) > 0.55)
    .map((m) => m.id);

  const contents = await prisma.content.findMany({
    where: { id: { in: ids } },
  });

  res.json({ contents });
});

router.post('/rag', userAuth, async (req: any, res: any) => {
  const { question } = req.body;
  // @ts-ignore
  const userId = req.userId;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const queryEmbedding = await getEmbedding(question);

  const result = await index.query({
    vector: queryEmbedding,
    topK: 6,
    filter: { userId: userId.toString() },
  });

  const ids = result.matches.map((m) => m.id);

  const contents = await prisma.content.findMany({
    where: { id: { in: ids } },
  });

  if (contents.length === 0) {
    return res.json({
      answer: "I couldn't find anything related in your brain yet.",
    });
  }

  const context = buildContext(contents);
  const prompt = `${system_prompt} this is context:${context} and this is the question that user asked:${question}`;

  for await (const chunk of askGeminiStream(prompt)) {
    res.write(`data: ${chunk}\n\n`);
  }

  res.write('data: [DONE]\n\n');
  res.end();
});