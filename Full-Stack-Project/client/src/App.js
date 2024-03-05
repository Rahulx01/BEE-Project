import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Room from "./components/room/room";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  useEffect(() => {
    toast("Welcome to the game");
  }, []);
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/room/:id" element={<Room></Room>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
