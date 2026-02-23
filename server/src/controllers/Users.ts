import { Router } from "express";
import { User } from "../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { isAuthorized } from "../utils/isAuthorized";
import { getUserFromRequest } from "../utils/getUserFromRequest";

const tokenSecretKey = process.env.SESSION_SECRET || "superlongstring";

const usersRouter = Router();

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [users]
 *     summary: Create a user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 *       400:
 *         description: Missing email or password
 *       500:
 *         description: Unable to create user
 */
usersRouter.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: `email and password are required` });
  }

  try {
    const user = new User();
    user.email = email;
    user.hashedPassword = await argon2.hash(password);
    await user.save();
    return res.json({ item: user });
  } catch (e) {
    console.error(`🆘 got error: ${JSON.stringify(e)}`, e);
    return res.status(500).json({ message: `unable to create user` });
  }
});

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [users]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       403:
 *         description: Access denied
 */
usersRouter.get("/me", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  return res.json({ item: user });
});

/**
 * @openapi
 * /api/users/tokens:
 *   post:
 *     tags: [users]
 *     summary: Create an authentication token
 *     description: Returns a JWT token and also sets the `token` httpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token created
 *       400:
 *         description: Wrong credentials or invalid body
 */
usersRouter.post("/tokens", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: `email and password are required` });
  }

  const user = await User.findOneBy({ email });

  if (!user) {
    return res.status(400).json({ message: `wrong credentials` });
  }

  try {
    if (await argon2.verify(user.hashedPassword, password)) {
      const token = jwt.sign({ userId: user.id }, tokenSecretKey);
      res.cookie("token", token, {
        httpOnly: true,
      });
      return res.json({ token: token });
    } else {
      return res.status(400).json({ message: `wrong credentials` });
    }
  } catch (err) {
    return res.status(400).json({ message: `wrong credentials` });
  }
});

export default usersRouter;
