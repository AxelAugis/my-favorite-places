import { Router } from "express";
import { getCoordinatesFromSearch } from "../utils/getCoordinatesFromSearch";
import { Address } from "../entities/Address";
import { isAuthorized } from "../utils/isAuthorized";
import { getUserFromRequest } from "../utils/getUserFromRequest";
import { getDistance } from "../utils/getDistance";

const addressesRouter = Router();

/**
 * @openapi
 * /api/addresses:
 *   post:
 *     tags: [addresses]
 *     summary: Create an address for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - searchWord
 *               - name
 *             properties:
 *               searchWord:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address created
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Access denied
 *       404:
 *         description: Search word not found
 */
addressesRouter.post("/", isAuthorized, async (req, res) => {
  const searchWord = req.body.searchWord;
  const name = req.body.name;
  const description = req.body.description;

  if (!searchWord || !name) {
    return res
      .status(400)
      .json({ message: `name and search word are required` });
  }

  const coordinates = await getCoordinatesFromSearch(searchWord);

  if (coordinates) {
    const user = await getUserFromRequest(req);
    const address = new Address();
    address.name = name;
    address.description = description;
    Object.assign(address, coordinates);
    address.user = user;
    await address.save();
    return res.json({ item: address });
  } else {
    return res.status(404).json({ message: `search word not found` });
  }
});

/**
 * @openapi
 * /api/addresses:
 *   get:
 *     tags: [addresses]
 *     summary: List authenticated user addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses list
 *       403:
 *         description: Access denied
 */
addressesRouter.get("/", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  const addresses = await Address.findBy({ user: { id: user.id } });
  return res.json({ items: addresses });
});

/**
 * @openapi
 * /api/addresses/searches:
 *   post:
 *     tags: [addresses]
 *     summary: Search addresses by radius around coordinates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - radius
 *               - from
 *             properties:
 *               radius:
 *                 type: number
 *                 minimum: 0
 *               from:
 *                 type: object
 *                 required:
 *                   - lat
 *                   - lng
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     responses:
 *       200:
 *         description: Filtered addresses list
 *       400:
 *         description: Invalid radius or coordinates
 *       403:
 *         description: Access denied
 */
addressesRouter.post("/searches", isAuthorized, async (req, res) => {
  const radius = req.body.radius;

  if (!radius || typeof radius !== "number" || radius < 0) {
    return res
      .status(400)
      .json({ message: `radius is required, must be a positive number` });
  }

  const from = req.body.from;

  if (
    !from ||
    !from.lng ||
    !from.lat ||
    typeof from.lng !== "number" ||
    typeof from.lat !== "number"
  ) {
    return res.status(400).json({
      message: `from object must contain lat and lng props, both numbers`,
    });
  }

  const user = await getUserFromRequest(req);
  const addresses = await Address.findBy({ user: { id: user.id } });
  const closeAddresses = [];

  for (const address of addresses) {
    if (getDistance(address, from) <= radius) {
      closeAddresses.push(address);
    }
  }

  return res.json({ items: closeAddresses });
});

export default addressesRouter;
