import { Router } from "express";
import { handleAsyncErrors } from "../helpers/route.helper";
import {
  createArt,
  getArt,
  deleteArt,
  updateArt,
  getArts,
} from "./controller/art.controller";

const router = Router();

//create a Art
router.post("/", handleAsyncErrors(createArt));

//update a Art
router.put("/:id", handleAsyncErrors(updateArt));

//get a Art
router.get("/:id", handleAsyncErrors(getArt));

//get Arts
router.get("/", getArts);

//delete a Art
router.delete("/:id", handleAsyncErrors(deleteArt));

export default router;
