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

//create a Art
router.post("/", createArtValidatorMiddleware, handleAsyncErrors(createArt));

//update a Art
router.put("/:id", updateArtValidatorMiddleware, handleAsyncErrors(updateArt));

//get a Art
router.get("/:id", getArtsMiddleware, handleAsyncErrors(getArt));

//get Arts
router.get("/", getArtsMiddleware, getArts);

//delete a Art
router.delete("/:id", handleAsyncErrors(deleteArt));

export default router;
