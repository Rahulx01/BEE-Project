import React, { useEffect, useState } from "react";
import WaitingRoom from "./waitingRoom";
import GameRoom from "./gameRoom";
import { useParams } from "react-router-dom";
import { socket } from "../../socket.js";
import { toast } from 'react-toastify';
export default function Room() {
  const [roomDetails, setRoomDetails] = useState(false);
  const { id: roomCode } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  useEffect(() => {
    toast(`welcome to the room ${roomCode}`, { type: "info" });
    console.log("This is in use Efect room.js");
    socket.emit("join-room", roomCode, document.cookie.replace("JWtoken=", ""));
    socket.on("room-join-success", (host, members) => {
      setRoomDetails({ host: host, members: members });
    });
    socket.on("room-join-failed", () => {
      console.log("room joined failed");
    });
  }, []);

  socket.on("ticket", (ticket) => {
    console.log("This is the ticket", ticket);
  });

  socket.on("new-user", (username) => {
    console.log("New user joined", username);
  });

  return (
    <>
      <h1>Hello this is roomcode {roomCode}</h1>
      {gameStarted ? (
        <GameRoom
          roomCode={roomCode}
          roomDetails={roomDetails}
        ></GameRoom>
      ) : (
        <WaitingRoom
          roomDetails={roomDetails}
          setGameStarted={setGameStarted}
        ></WaitingRoom>
      )}
    </>
  );
}
