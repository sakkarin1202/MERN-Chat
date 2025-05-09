import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
dotenv.config();
import authRouter from "./routes/auth.router.js";
import messageRouter from "./routes/message.router.js";
import friendRouter from "./routes/friend.router.js";
const PORT = process.env.PORT;

// const DB_URL = process.env.DB_URL;
// try {
//   mongoose.connect(DB_URL);
//   console.log("Connect to mongo DB Successfully");
// } catch (error) {
//   console.log("DB Connection Failed");
// }

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Mern Chat api</h1>");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/friend", friendRouter);
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
