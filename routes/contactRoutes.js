import express from "express";
import mailController from "../controller/contactController.js"

const router = express.Router();

router.post("/sendMail", mailController.sendMail);

export default router;
