import express from "express";

const corpusRouter = express.Router();

corpusRouter.get("/corpus/search", (req, res) => {

    const { corpus, searchWord } = req.body;

    if(!Array.isArray(corpus)) {
        return res.status(400).json({ message: `corpus must be an array of strings` });
    }
    
    if (!searchWord) {
        return res.status(400).json({ message: `search word is required` });
    }

    let wordCount = 0;

    const results = corpus.map((text: string) => {
        const regex = new RegExp(String.raw`\b${searchWord}\b`, 'gi');
        const matches = text.toLocaleLowerCase().match(regex);
        const count = matches ? matches.length : 0;
        wordCount += count;
        return count;
    });

    res.json({ wordCount });
});

export default corpusRouter;
