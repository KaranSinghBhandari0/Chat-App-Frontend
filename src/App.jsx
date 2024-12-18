import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

import { AuthContext } from "./context/AuthContext";

const App = () => {

  const {authUser, isAuthenticated, isCheckingAuth, theme, onlineUsers} = useContext(AuthContext);

  useEffect(()=>{
  },[onlineUsers])

  // checing authorization
  useEffect(()=> {
    isAuthenticated();
  },[isAuthenticated])

  // Toogle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme]);

  // Loading State
  if(isCheckingAuth && !authUser)
    return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );

  return (
    <div>
      <Navbar/>
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      <Toaster />
    </div>
  );
};

export default App;