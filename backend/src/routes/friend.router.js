import express from "express";
import {
  addFriend,
  acceptFriendRequest,
} from "../controllers/friend.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express();
router.post("/add", protectedRoute, addFriend);
router.post("/accept", protectedRoute, acceptFriendRequest);

export default router;
