import express from "express";
const router = express.Router();
import {
  getUserForSidebar,
  getMessage,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { checkFriendShip } from "../middlewares/friend.middleware.js";

router.get("/users", protectedRoute, getUserForSidebar);
router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, checkFriendShip, sendMessage);
export default router;
