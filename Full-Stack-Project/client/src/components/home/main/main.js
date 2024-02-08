import React from 'react';
import { useNavigate } from 'react-router-dom';;
export default (props) => {
    const navigate = useNavigate();
    const hostRoom = async() => {
        if(props.user) {
            try {
                fetch("http://localhost:8000/host",{
                method: "GET",
                credentials: "include"
            }).then(res => {
                res.json().then(resBody => {
                    navigate(`/room/${resBody?.roomCode}`);
                });
            });
            }
            catch(err) {
                console.log("An error occured while fetching the room code",err)
            }
        }
        else props.setShowLogin(true);
    }
    function joinRoom(){
        if(props.user) {
            const roomCode = prompt("Enter room code");
            //fetch function
            if(roomCode) navigate(`/room/${roomCode}`);
        }
        else props.setShowLogin(true);
    }
    return(
        <>
            <h1>I am main</h1>
            <button type="button" className ="btn btn-secondary" onClick={hostRoom}>host</button>
            <button type="button" className ="btn btn-secondary" onClick={joinRoom}>join</button>
        </>
    )
}