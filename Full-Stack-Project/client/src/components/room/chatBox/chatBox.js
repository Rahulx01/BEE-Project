import React from "react";
import "./chatbox.css";
import { socket } from "../../../socket.js";

export default (props) => {
  const handleSendMessage = () => {
    const message = document.getElementById("chatInput").value;
    if (!message) return;
    //send message to room members

    socket.emit("room-chat-message", props.roomCode, message);
  };
  socket.on("room-chat-message", (message) => {
    console.log(message);
    const chatMessages = document.getElementById("chat-messages");
    const newMessage = document.createElement("div");
    newMessage.innerHTML = message;
    chatMessages.appendChild(newMessage);
  });
  return (
    <div className="chat-container">
      <div id="chat-messages"></div>
      <div className="message-input-container">
        <input type="text" placeholder="Type your message" id="chatInput" />
        <button className="btn btn-secondary" onClick={handleSendMessage}>
          Send
        </button>
      </div>

    </div>
  );
};
