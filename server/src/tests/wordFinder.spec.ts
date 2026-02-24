import request from "supertest";
import express from "express";
import corpusRouter from "./controllers/WordFinder";
import { firstCorpus, secondCorpus, thirdCorpus } from "../utils/resources/corpuses";

describe("WordFinder Routes", () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(corpusRouter);
    });

    describe("GET /corpus/search", () => {
        it("should count occurrences of 'lorem' in firstCorpus", async () => {
        const response = await request(app)
            .get("/corpus/search")
            .send({
            corpus: firstCorpus,
            searchWord: "lorem",
            });

        expect(response.status).toBe(200);
        expect(response.body.wordCount).toEqual(7);
        });

        it("should count occurrences of 'liquor' in secondCorpus", async () => {
        const response = await request(app)
            .get("/corpus/search")
            .send({
            corpus: secondCorpus,
            searchWord: "liquor",
            });

        expect(response.status).toBe(200);
        expect(response.body.wordCount).toEqual(5);
        });

        it("should count occurrences of 'zebras' in thirdCorpus", async () => {
        const response = await request(app)
            .get("/corpus/search")
            .send({
            corpus: thirdCorpus,
            searchWord: "zebras",
            });

        expect(response.status).toBe(200);
        expect(response.body.wordCount).toEqual(4);
        });

        it("should return 400 if corpus is not an array", async () => {
        const response = await request(app)
            .get("/corpus/search")
            .send({
            corpus: "not an array",
            searchWord: "hello",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "corpus must be an array of strings"
        );
        });

        it("should return 400 if searchWord is missing", async () => {
        const response = await request(app)
            .get("/corpus/search")
            .send({
                corpus: ["hello world"],
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("search word is required");
        });

        it("should handle case-insensitive search", async () => {
        const response = await request(app)
            .get("/corpus/search")
            .send({
                corpus: ["Hello world", "hello world"],
                searchWord: "hello",
            });

        expect(response.status).toBe(200);
        expect(response.body.wordCount).toEqual(2);
        });
    });
});
