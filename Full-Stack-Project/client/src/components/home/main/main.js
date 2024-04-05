import React from 'react';
import './main.css';
import { useNavigate } from 'react-router-dom';

export default (props) => {
    const navigate = useNavigate();
    const hostRoom = async () => {
        if (props.user) {
            try {
                fetch(`${process.env.REACT_APP_API_KEY}/host`, {
                    method: "GET",
                    credentials: "include"
                }).then(res => {
                    res.json().then(resBody => {
                        navigate(`/room/${resBody?.roomCode}`);
                    });
                });
            }
            catch (err) {
                console.log("An error occured while fetching the room code", err)
            }
        }
        else props.setShowLogin(true);
    }
    function joinRoom() {
        if (props.user) {
            const roomCode = prompt("Enter room code");
            //fetch function
            if (roomCode) navigate(`/room/${roomCode}`);
        }
        else props.setShowLogin(true);
    }
    return (
        <>
            <div className="d-flex flex-column align-items-center  justify-content-start mt-4">
                <div><h3>Welcome to online tambola</h3></div>
                <div>
                    <button className="button-74 mr-2" role="button" onClick={hostRoom}>host</button>
                    <button className="button-74" role="button" onClick={joinRoom}>join</button>
                </div>
            </div>
        </>
    )
}