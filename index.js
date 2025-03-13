import express from 'express';
import cors from 'cors';
import { translate } from "@vitalets/google-translate-api";
import pLimit from 'p-limit';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

const limit = pLimit(2); 

app.get("/", (req, res) => {
    res.send("Translation API is running 🚀");
});

app.post("/translate", async (req, res) => {
    const { text, from = "auto", to = "en" } = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Некорректный ввод текста" });
    }

    try {
        const result = await limit(() => translate(text, { from, to }));
        res.json({ translatedText: result.text });
    } catch (error) {
        console.error("Ошибка перевода:", error);
        res.status(500).json({ error: "Ошибка перевода. Попробуйте снова позже." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port - ${PORT}`);
});
