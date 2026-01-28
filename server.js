import express from "express";
import cors from "cors";
import { getTranscript } from "youtube-transcript";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/subtitle", async (req, res) => {
  try {
    const { url } = req.body;
    const transcript = await getTranscript(url);
    res.json({
      subtitles: transcript.map(t => t.text)
    });
  } catch {
    res.status(400).json({ error: "No subtitle found" });
  }
});

app.post("/api/translate", async (req, res) => {
  try {
    const r = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: req.body.text,
        source: "en",
        target: "my"
      })
    });
    const d = await r.json();
    res.json({ translated: d.translatedText || "" });
  } catch {
    res.json({ translated: "" });
  }
});

app.listen(3000);
