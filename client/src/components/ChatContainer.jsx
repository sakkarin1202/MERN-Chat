import { useEffect, useRef } from "react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/util.js";
const ChatContainer = () => {
  const {
    messages,
    getMessage,
    isMessageLoading,
    selectedUser,
    subscribeToMessage,
    unsubscribeFromMessage,
    isFriend,
    friendRequestSent,
    friendRequestReceived,
    addFriend,
    acceptFriendRequest,
    setIsFriend,
    setFriendRequestSent,
    setFriendRequestReceived,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  //get chat message
  useEffect(() => {
    //get history messages
    getMessage(selectedUser._id);
    //lister to socket
    subscribeToMessage();
    return () => unsubscribeFromMessage();
  }, [
    selectedUser._id,
    getMessage,
    subscribeToMessage,
    unsubscribeFromMessage,
  ]);
  useEffect(() => {
    if (authUser && selectedUser) {
      setIsFriend(authUser.friends?.includes(selectedUser._id));
      setFriendRequestReceived(
        authUser.friendRequests?.includes(selectedUser._id)
      );
      setFriendRequestSent(selectedUser.friendRequests?.includes(authUser._id));
      console.log("setIsFriend", authUser.friends.includes(selectedUser._id));
    }
  }, [
    setIsFriend,
    setFriendRequestReceived,
    setFriendRequestSent,
    authUser,
    selectedUser,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleAddFriend = () => {
    addFriend(selectedUser._id);
    setFriendRequestSent(true);
  };
  const handleAcceptRequest = () => {
    console.log("sad", handleAcceptRequest);
    acceptFriendRequest(selectedUser._id);
    setFriendRequestReceived(false);
    setIsFriend(true);
    getMessage(selectedUser._id);
  };

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      {!isFriend && !friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-red-500">
          You must be friend with this user to send messages.
          <button className="btn btn-sm mt-2" onClick={handleAddFriend}>
            Add Friend
          </button>
        </div>
      )}
      {!isFriend && friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-yellow-500">
          Friend request sent Waiting for acceptance.
        </div>
      )}
      {!isFriend && !friendRequestSent && friendRequestReceived && (
        <div
          className="p-4 text-center text-green-500"
          onClick={handleAcceptRequest}
        >
          You must be friend with this user to send messages.
          <button className="btn btn-sm mt-2">Accept friend request</button>
        </div>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
