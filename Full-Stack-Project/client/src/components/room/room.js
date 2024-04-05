import React, { useEffect, useState } from "react";
import WaitingRoom from "./waitingSection/waitingRoom.js";
import ChatBox from "./chatBox/chatBox";
import GameSection from "./gameSection/gameSection";
import { useParams } from "react-router-dom";
import { socket } from "../../socket.js";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function Room() {
  const { id: roomCode } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState({
    roomCode: roomCode,
    isHost: "",
    members: [],
  });
  const [gameActiveStatus, setGameActiveStatus] = useState(false);

  const setGameStatus = (gameActiveStatus) => {
    setGameActiveStatus(gameActiveStatus);
    socket.emit("game-status", roomCode, gameActiveStatus);
  }

  // const changeControl = () => {
  //   setGameActiveStatus(true);

  // }

  useEffect(() => {

    socket.emit("join-room", roomCode, document.cookie.replace("JWtoken=", ""));

    const handleRoomJoinSuccess = (isHost, members, roomActiveStatus) => {
      setRoomDetails({ roomCode: roomCode, isHost: isHost, members: members });
      // console.log("Room Active Status", roomActiveStatus);
      // setGameActiveStatus(roomActiveStatus);
    };

    const handleRoomJoinFailed = () => {
      toast.error("Failed to join room");
      navigate("/");
    };

    const handleNewUser = (username) => {
      console.log("User is joining", username);
      setRoomDetails((prevRoomDetails) => ({
        ...prevRoomDetails,
        members: [...prevRoomDetails.members, username],
      }));
      toast.info(`${username} joined the room`);
    };

    const handleUserLeft = (username) => {
      setRoomDetails((prevRoomDetails) => ({
        ...prevRoomDetails,
        members: prevRoomDetails.members.filter((member) => member !== username),
      }));
      toast.info(`${username} left the room`);
    };

    const handleGameStatus = (gameActiveStatus) => {
      setGameActiveStatus(gameActiveStatus);
    }

    socket.on("room-join-success", handleRoomJoinSuccess);
    socket.on("room-join-failed", handleRoomJoinFailed);
    socket.on("new-user", handleNewUser);
    socket.on("user-left", handleUserLeft);
    socket.on("game-status", handleGameStatus);
    // socket.on("game-over",);
    return () => {
      console.log("Leaving room");
      socket.emit('leave-room', roomCode);

      // Cleanup event listeners
      socket.off("room-join-success", handleRoomJoinSuccess);
      socket.off("room-join-failed", handleRoomJoinFailed);
      socket.off("new-user", handleNewUser);
      socket.off("user-left", handleUserLeft);
      socket.off("game-status", handleGameStatus);
      // socket.off("game-over");
    };
  }, []); //remove dependecy if error occured add this [roomCode, navigate]

  return (
    <>
      <div className="p-2 d-flex justify-content-center align-items-center">
        <h3 style={{ marginRight: '10px' }}>Share with other Players</h3>
        <button
          className="btn btn-dark"
          onClick={() => navigator.clipboard.writeText(document.location.href)}
        >
          Copy link
        </button>
      </div>

      <br></br>
      <br></br>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-12 order-md-1">
            {gameActiveStatus ? (
              <GameSection roomDetails={roomDetails}></GameSection>
            ) : (
              <WaitingRoom
                roomDetails={roomDetails}
                setGameStatus={setGameStatus}
              ></WaitingRoom>
            )}

          </div>
          <div className="col-lg-4 col-md-12 order-md-2">
            <ChatBox roomDetails={roomDetails}></ChatBox>
          </div>
        </div>
      </div>
    </>
  );
}
