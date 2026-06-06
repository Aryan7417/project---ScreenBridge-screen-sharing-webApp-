import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import WaitingRoom from "./pages/WaitingRoom";
import HostDashboard from "./pages/HostDashboard";
import ViewerDashboard from "./pages/ViewerDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import "./App.css";
import { useEffect } from "react";
import socket from "../src/services/socket.js"
import peer from "./services/peer.js"


window.socket = socket;




// Page Wrapper for smooth route transitions
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};


function App() {
  const location = useLocation();

  useEffect(()=>{
    console.log(socket.connected)

    
    socket.on("connect",()=>{
    console.log("Connected :",socket.id);
    socket.emit("join-room","room1");

    });
    
    socket.on("user-joined", async(id)=>{

   console.log("New User Joined :",id);

   const offer = await peer.createOffer();

   await peer.setLocalDescription(offer);

   socket.emit("offer",{
      offer,
      to:id
   });

});

socket.on("offer",(data)=>{
  console.log("offer Recived:",data)
})


    return ()=>{

      socket.off("connect");
      socket.off("user-joined");
      socket.off("offer")

    }

  },[]);


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/create"
          element={
            <PageTransition>
              <CreateRoom />
            </PageTransition>
          }
        />
        <Route
          path="/join"
          element={
            <PageTransition>
              <JoinRoom />
            </PageTransition>
          }
        />
        <Route
          path="/waiting/:roomId"
          element={
            <PageTransition>
              <WaitingRoom />
            </PageTransition>
          }
        />
        <Route
          path="/host/:roomId"
          element={
            <PageTransition>
              <HostDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/viewer/:roomId"
          element={
            <PageTransition>
              <ViewerDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignUp />
            </PageTransition>
          }
        />
        {/* Fallback routes for specific mock paths */}
        <Route
          path="/history"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        <Route
          path="/devices"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        <Route
          path="/analytics"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        <Route
          path="/team"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        <Route
          path="/support"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
