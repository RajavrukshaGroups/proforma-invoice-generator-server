// import express from "express";
// const router = express.Router();

// import {
//   register,
//   login,
//   forgotPassword,
//   resetPassword,
// } from "../controller/authController.js";

// router.post("/register", register);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.put("/reset-password/:token", resetPassword);

// export default router;

import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;