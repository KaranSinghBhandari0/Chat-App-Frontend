import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:3000";

    // some global states
    const [authUser, setAuthUser] = useState(null);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [socket, setSocket] = useState(null);

    // check if user is Authenticated
    const isAuthenticated = async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            setAuthUser(res.data);
            connectSocket();
        } catch(error) {
            console.log("Error in checkAuth:", error);
            setAuthUser(null)
        } finally {
            setIsCheckingAuth(false);
        }
    }

    // signup
    const signup = async (formData) => {
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            setIsSigningUp(true);
            setAuthUser(res.data);
            connectSocket();
            toast.success("Account created successfully");
            navigate('/');
        } catch(error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {            
            setIsSigningUp(false);
        }
    }

    // login
    const login = async (formData) => {
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            setIsLoggingIn(true);
            setAuthUser(res.data);
            connectSocket();
            toast.success("login successfull");
            navigate('/');
        } catch(error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {            
            setIsLoggingIn(false);
        }
    }

    // logout
    const logout = async () => {
        try {
            const res = await axiosInstance.get("/auth/logout");
            toast.success("logout successfull");
            disconnectSocket();
            navigate('/login');
        } catch(error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {            
            setAuthUser(null);
        }
    }

    // update Profile
    const updateProfile = async (data) => {
        try {
            setIsUpdatingProfile(true);
            const res = await axiosInstance.put("/auth/update-profile", data);
            setAuthUser(res.data);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    }

    // Connect socket
    const connectSocket = () => {
        if(!authUser || socket?.connected) return; // Avoid duplicate connections

        const newSocket = io(BASE_URL, { query: { userId: authUser._id } } );

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    // Disconnect socket
    const disconnectSocket = () => {
        if (socket?.connected) {
            socket.disconnect();
            setSocket(null);
            setOnlineUsers([]);
        }
    };
    
    return (
        <AuthContext.Provider value={{authUser, isSigningUp, isLoggingIn, isCheckingAuth, isUpdatingProfile, onlineUsers, theme, setTheme, isAuthenticated, signup, login, logout, updateProfile, socket}}>
            {children}
        </AuthContext.Provider>
    );
};