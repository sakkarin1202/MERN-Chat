import { text } from "express";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
