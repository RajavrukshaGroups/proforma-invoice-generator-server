import express from "express";
import pdfController from "../controller/pdfController.js";

const router = express.Router();

router.post("/generate-pdf", pdfController.generatePDF);

export default router;