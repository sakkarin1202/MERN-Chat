import express from "express";
const router = express.Router();
import { getUserForSidebar } from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

router.get("/users", protectedRoute, getUserForSidebar);
export default router;
