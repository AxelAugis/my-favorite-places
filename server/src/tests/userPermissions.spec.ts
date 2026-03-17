import datasource from "../datasource";
import request from "supertest";
import app from "../app";
import {faker} from "@faker-js/faker";
import {User} from "../entities/User";

describe("Security Test - No Authorization", () => {
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
    let authorizationTokenU1 = "";
    let authorizationTokenU2 = "";

    let user1: User;
    let user2: User;

    it("should be able to create a user1 account", async () => {
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

        if (createdUser) {
            user1 = createdUser;
        }
    });

    it("should be able to create a user2 account", async () => {
        const response = await request(app).post("/api/users").send({
            email: faker.internet.email().toLowerCase(),
            password: faker.internet.password({length: 16}),
        });

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            item: {
                id: expect.any(Number),
                email: expect.any(String),
                createdAt: expect.any(String),
            }
        });

        const userRepository = datasource.getRepository(User);
        const createdUser = await userRepository.findOneBy({
            email: response.body.item.email,
        });

        expect(createdUser).not.toBeNull();
        expect(createdUser?.hashedPassword).toBeDefined();

        if (createdUser) {
            user2 = createdUser;
        }
    });

    it("should be able to retrieve JWT token", async () => {
        const response = await request(app).post("/api/users/tokens").send({
            email: emailToCreate,
            password: passwordToCreate,
        });

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            token: expect.any(String),
        });

        authorizationTokenU1 = response.body.token;
    });

    it("should not delete user2 with user1's token", async () => {
        const response = await request(app)
            .delete(`/api/users/${user2.id}`)
            .set("Authorization", `Bearer ${authorizationTokenU1}`);

        expect(response.status).toBe(403);
    });
});