import { create } from "zustand";
import api from "../services/api.js";
import { useAuthStore } from "./useAuthStore.js";
import toast from "react-hot-toast";
export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isFriend: false,
  friendRequestSent: false,
  friendRequestReceived: false,
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error.res.data.message || "Something went wrong while fetching users"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get("/message/" + userId);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error.res.data.message || "Something went wrong while getting message"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(
        "/message/send/" + selectedUser._id,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending message"
      );
    } finally {
      set({ isSendingMessage: false });
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendErrorSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendErrorSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  addFriend: async (friendId) => {
    try {
      const res = await api.post("/friend/add", { friendId });
      toast.success(res.data.message);

      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("friendRequestSent", friendId);
      }
      set({ friendRequestSent: true });
    } catch (error) {
      console.error("Error in addFriend:", error);
      toast.error(
        error.response.data.message ||
          "Something went wrong while adding friend"
      );
    }
  },
  acceptFriendRequest: async (friendId) => {
    try {
      const res = await api.post("friend/accept", { friendId });
      toast.success(res.data.message);
      useAuthStore.getState().socket.emit("friendRequestAccepted", friendId);
      set({ isFriend: true, friendRequestReceived: false });
    } catch (error) {
      console.error("Error in addFriend:", error);
      toast.error(
        error.response.data.message ||
          "Something went wrong while adding friend"
      );
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setIsFriend: (isFriend) => set({ isFriend }),
  setFriendRequestSent: (sent) => set({ friendRequestSent: sent }),
  setFriendRequestReceived: (received) =>
    set({ friendRequestReceived: received }),
}));
