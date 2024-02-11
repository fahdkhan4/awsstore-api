import express from "express";
import { uploadDocumentController } from "./controller/document.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/upload", upload.array("files"), uploadDocumentController);

export default router;
