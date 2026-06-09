import express from "express"
const router = express.Router();

import PIController from "../controller/PIController.js"

router.post("/createPI", PIController.createPI)
router.get("/getPI/:id", PIController.getPI)
router.get("/getAllPI", PIController.getAllPI)
router.delete("/deletePI/:id", PIController.deletePI)
router.put("/updatePI/:id", PIController.updatePI)
router.post("/saveSettings", PIController.saveSettings)
router.get("/getSettings", PIController.getSettings)

export default router;