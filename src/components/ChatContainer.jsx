import { useContext, useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

export default function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const messageEndRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id).catch(err => {
        setError(err.response.data.message || 'Failed to load messages');
      });
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  // Scroll on new message
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
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
        {error && <div className="text-red-500">{error}</div>}
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.image || "/avatar.png"
                        : selectedUser.image || "/avatar.png"
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
          ))
        )}
      </div>

      <MessageInput />
    </div>
  );
}
