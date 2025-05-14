import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createArt,
  getArt,
  deleteArt,
  updateArt,
  getArts,
} from "./controller/art.controller";
import {
  createArtValidatorMiddleware,
  updateArtValidatorMiddleware,
  getArtsMiddleware,
} from "./art.validator";

const router = Router();

/**
 * @openapi
 * /arts:
 *   post:
 *     tags:
 *       - Art
 *     summary: Create a new art item
 *     description: Creates a new art entry in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArtInput'
 *     responses:
 *       201:
 *         description: Successfully created art
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Art'
 *       400:
 *         description: Validation error
 */
router.post("/", createArtValidatorMiddleware, handleAsyncErrors(createArt));

/**
 * @openapi
 * /arts/{id}:
 *   put:
 *     tags:
 *       - Art
 *     summary: Update an existing art item
 *     description: Updates an art entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateArtInput'
 *     responses:
 *       200:
 *         description: Successfully updated art
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Art'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Art not found
 */
router.put("/:id", updateArtValidatorMiddleware, handleAsyncErrors(updateArt));

/**
 * @openapi
 * /arts/{id}:
 *   get:
 *     tags:
 *       - Art
 *     summary: Get a single art item
 *     description: Fetches a specific art by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single art object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Art'
 *       404:
 *         description: Art not found
 */
router.get("/:id", getArtsMiddleware, handleAsyncErrors(getArt));

/**
 * @openapi
 * /arts:
 *   get:
 *     tags:
 *       - Art
 *     summary: Get all art items
 *     description: Returns a list of all available art items
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         default: 0
 *     responses:
 *       200:
 *         description: A paginated list of art items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Art'
 */
router.get("/", getArtsMiddleware, getArts);

/**
 * @openapi
 * /arts/{id}:
 *   delete:
 *     tags:
 *       - Art
 *     summary: Delete an art item
 *     description: Deletes an art by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       404:
 *         description: Art not found
 */
router.delete("/:id", handleAsyncErrors(deleteArt));

export default router;