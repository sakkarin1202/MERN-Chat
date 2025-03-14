import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server Error while getting user info" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    if (!receiverId) {
      return res.status(400).json({ message: " Receiver Id is required" });
    }

    const senderId = req.user._id;

    // console.log("receiverId : ",receiverId);
    // console.log("senderId : ",senderId);

    //const imageURL
    const { text, image } = req.body;
    let imageURL;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadedResponse.secure_url;
    }

    const newMessage = await new Message({
      senderId: senderId,
      receiverId: receiverId,
      text,
      image: imageURL,
    });
    await newMessage.save();

    //Real time Chat ##Hot!
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Internal Server Error while sending message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    console.log(userToChatId);

    const myId = req.user._id;
    console.log(myId);

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json(messages);
    console.log(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while getting message" });
  }
};
