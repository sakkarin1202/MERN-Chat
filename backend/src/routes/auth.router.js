import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";

router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", logout);
router.put("/update-profile/:id", updateProfile);

export default router;
