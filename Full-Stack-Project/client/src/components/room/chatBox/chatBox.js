import React, { useState, useEffect } from "react";
import "./chatbox.css";
import { socket } from "../../../socket";

export default ({ roomDetails }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("room-chat-message", roomDetails.roomCode, newMessage);
      setMessages((prevMessages) => [...prevMessages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    socket.on("room-chat-message", (username, message) => {
      setMessages((prevMessages) => [...prevMessages, { user: username, text: message }]);
    });
  }, []); //removed socket from dependency

  return (
    <div className="chat-box d-flex flex-column">
      <div className="chat-header d-flex justify-content-between align-items-center border-bottom border-secondary">
        <h3>Chat</h3>
        <span>Room Code: {roomDetails.roomCode}</span>
      </div>
      <div className="chat-messages flex-grow-1 overflow-auto pb-2">
        {messages.map((message, index) => (
          <div key={index} className="message border-bottom border-secondary p-2">
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input d-flex align-items-center mt-2">
        <input
          type="text"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUpCapture={(e) => { e.key === "Enter" && handleSendMessage() }}
          className="form-control flex-grow-1 mr-2"
        />
        <button className="btn btn-primary send-btn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};
