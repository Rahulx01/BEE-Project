import React, {useState} from 'react';
import WaitingRoom from './waitingRoom';
import GameRoom from './gameRoom';
import { useParams } from 'react-router-dom';
export default function Room(props) {
    const { id: roomCode } = useParams();
    const [gameStarted, setGameStarted] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const socket = props.socket;
    socket.emit('join-room', roomCode);
    // socket.on('new-user', (message) => {
    //     console.log(message);
    // });
    return (
        <>
            <h1>Hello this is roomcode {roomCode}</h1>
            {gameStarted? <GameRoom socket={socket}></GameRoom> : <WaitingRoom socket={socket}></WaitingRoom>}
        </>
    )
}