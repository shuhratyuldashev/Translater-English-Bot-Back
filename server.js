import express from 'express';
import cors from 'cors';
import { translate } from "@vitalets/google-translate-api";
import pLimit from 'p-limit';

const app = express();
app.use(cors());
app.use(express.json());

const startBackend = async () => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};

const limit = pLimit(2); 

app.post("/translate", async (req, res) => {
    const { text, from, to } = req.body;
  
    if (!text) {
        return res.status(400).json({ error: "Текст не может быть пустым" });
    }
  
    try {
        const result = await limit(() => translate(text, { from, to }));
        res.json({ translatedText: result.text });
    } catch (error) {
        console.error("Ошибка перевода:", error);
        res.status(500).json({ error: "Ошибка перевода. Подождите немного и попробуйте снова." });
    }
});
startBackend();