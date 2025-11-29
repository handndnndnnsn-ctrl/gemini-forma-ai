const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt || "";
  if (!prompt) return res.json({ success:false });

  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateImage?key=" +
    GEMINI_API_KEY;

  const reply = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: { text: prompt },
      image: { mimeType: "image/png" }
    }),
  });

  const json = await reply.json();
  const base64 = json?.generatedImages?.[0]?.bytes;
  res.json({ success:true, imageUrl: "data:image/png;base64," + base64 });
});

app.listen(3000, () => console.log("Running"));
