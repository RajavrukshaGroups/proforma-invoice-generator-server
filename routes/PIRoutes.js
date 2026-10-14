import express from "express";
const router = express.Router();

import PIController from "../controller/PIController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/createPI", authMiddleware, PIController.createPI);
router.get("/getPI/:id", authMiddleware, PIController.getPI);
router.get("/getAllPI", authMiddleware, PIController.getAllPI);
router.delete("/deletePI/:id", authMiddleware, PIController.deletePI);
router.put("/updatePI/:id", authMiddleware, PIController.updatePI);
router.post("/saveSettings", PIController.saveSettings);
router.get("/getSettings", PIController.getSettings);
router.post("/exportToSheet/:id", authMiddleware, PIController.exportToSheet);
router.post("/exportAllToSheet", authMiddleware, PIController.exportAllToSheet);
router.get("/getSheetInfo", PIController.getSheetInfo);

export default router;
