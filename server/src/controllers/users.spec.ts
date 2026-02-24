import datasource from "../datasource";
import request from "supertest";
import app from "../app";
import {faker} from "@faker-js/faker";
import {User} from "../entities/User";

describe("App - Users", () => {
    beforeAll(async () => {
        if (!datasource.isInitialized) {
            await datasource.initialize();
        }
    });

    afterAll(async () => {
        if (datasource.isInitialized) {
            await datasource.destroy();
        }
    });

    const emailToCreate = faker.internet.email().toLowerCase();
    const passwordToCreate = faker.internet.password({length: 16});
    let authorizationToken = "";

    it("should be able to create a user account", async () => {
        const response = await request(app).post("/api/users").send({
            email: emailToCreate,
            password: passwordToCreate,
        });

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            item: {
                id: expect.any(Number),
                email: emailToCreate,
                createdAt: expect.any(String),
            }
        });

        const userRepository = datasource.getRepository(User);
        const createdUser = await userRepository.findOneBy({
            email: emailToCreate,
        });

        expect(createdUser).not.toBeNull();
        expect(createdUser?.hashedPassword).toBeDefined();
        expect(createdUser?.hashedPassword).not.toBe(passwordToCreate);
    });

    it("should be able to retrieve JWT token", async () => {
        const response = await request(app).post("/api/users/tokens").send({
            email: emailToCreate,
            password: passwordToCreate,
        });

        console.log(emailToCreate, passwordToCreate, response.body);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            token: expect.any(String),
        });

        authorizationToken = response.body.token;
    });

    it("should be able to get the authenticated user's details", async () => {
        const responseFailed = await request(app).get("/api/users/me").send();

        expect(responseFailed.status).toBe(403);

        const responseSucces = await request(app).get("/api/users/me").set("Authorization", `Bearer ${authorizationToken}`).send();

        expect(responseSucces.status).toBe(200);

        expect(responseSucces.body).toEqual({
            item: {
                id: expect.any(Number),
                email: emailToCreate,
                createdAt: expect.any(String),
            }
        });
    });
});