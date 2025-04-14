// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import OpenAI from 'openai';

config(); // Load .env variables

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your index.html here

app.post('/api/generate-recipe', async (req, res) => {
  const { itemName, servings, preferences } = req.body;

  try {
    const prompt = `Generate a detailed cooking recipe for ${servings} people using "${itemName}". Include ingredients and step-by-step instructions. Dietary preferences: ${preferences || "none"}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const recipe = completion.choices[0].message.content;
    res.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
