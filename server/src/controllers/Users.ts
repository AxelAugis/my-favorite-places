import { Router } from "express";
import { User } from "../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { isAuthorized } from "../utils/isAuthorized";
import { getUserFromRequest } from "../utils/getUserFromRequest";

const tokenSecretKey = process.env.SESSION_SECRET || "superlongstring";
const isProduction = process.env.NODE_ENV === "production";
const cookieSameSite =
  (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none" | undefined) ||
  "lax";
const cookieSecure =
  process.env.COOKIE_SECURE === "true" || (isProduction && cookieSameSite === "none");
const authCookieOptions = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
  path: "/",
} as const;

const usersRouter = Router();

type UserDto = {
  id: number;
  email: string;
  createdAt: string;
};

function serializeUser(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Unable to create user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
    return res.json({ item: serializeUser(user) });
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
usersRouter.get("/me", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    return res.status(403).json({ message: `access denied` });
  }
  return res.json({ item: serializeUser(user) });
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Wrong credentials or invalid body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
      res.cookie("token", token, authCookieOptions);
      return res.json({ token: token });
    } else {
      return res.status(400).json({ message: `wrong credentials` });
    }
  } catch (err) {
    return res.status(400).json({ message: `wrong credentials` });
  }
});

/**
 * @openapi
 * /api/users/tokens:
 *   delete:
 *     tags: [users]
 *     summary: Logout current user
 *     description: Clears the `token` httpOnly cookie. This endpoint is idempotent.
 *     responses:
 *       200:
 *         description: Logout successful (or no active session)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 */
usersRouter.delete("/tokens", (_req, res) => {
  res.clearCookie("token", authCookieOptions);
  return res.json({ message: "logged out" });
});

export default usersRouter;
