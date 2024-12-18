import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUsersLoading, setIsUserLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const { socket } = useContext(AuthContext);

    const getUsers = async () => {
        try {
            setIsUserLoading(true);
            const res = await axiosInstance.get("/messages/users");
            setUsers(res.data);
        } catch (error) {
            console.log(error.response.data.message);
        } finally {
            setIsUserLoading(false);
        }
    };

    const getMessages = async (userId) => {
        try {
            setIsMessagesLoading(true);
            const res = await axiosInstance.get(`/messages/${userId}`);
            setMessages(res.data);
        } catch (error) {
            console.log(error.response.data.message);
        } finally {
            setIsMessagesLoading(false);
        }
    };

    const sendMessage = async (messageData) => {
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            setMessages((prevMessages) => [...prevMessages, res.data]);
            socket.emit("sendMessage", { ...res.data, recipientId: selectedUser._id });
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    const subscribeToMessages = () => {
        if (!selectedUser) return;

        socket.on("newMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    };

    const unsubscribeFromMessages = () => {
        socket.off("newMessage");
    };

    return (
        <ChatContext.Provider value={{
            messages,
            users,
            selectedUser,
            setSelectedUser,
            isUsersLoading,
            isMessagesLoading,
            getUsers,
            getMessages,
            sendMessage,
            subscribeToMessages,
            unsubscribeFromMessages
        }}>
            {children}
        </ChatContext.Provider>
    );
};
