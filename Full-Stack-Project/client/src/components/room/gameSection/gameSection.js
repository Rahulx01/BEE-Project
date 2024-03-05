import React, { useState, useEffect } from 'react';
import Ticket from './tambolaTicket';
import { socket } from '../../../socket';

export default function GameSection(props) {
    const [ticket, setTicket] = useState(null);
    const [signedTicket, setSignedTicket] = useState(null);
    useEffect(() => {
        socket.emit('get-ticket');
    }, []);
    function claimTicket(claimType) {
        socket.emit('claim-ticket', claimType, signedTicket, props.roomCode, document.cookie.replace("JWtoken=", ""));
    }
    socket.on('ticket', (ticket, signedTicket) => {
        setTicket(ticket);
        setSignedTicket(signedTicket);
    });
    socket.on('claim-ticket', (claimType) => {
        console.log('This is the claim type', claimType);
    });
    socket.on('bogey', (claimType, username) => {
        console.log('This is the claim type', claimType);
    });

    return (
        <>
            <div>
                <Ticket ticket={ticket}></Ticket>
            </div>
            <div>
                <button className="btn btn-primary" onClick={() => claimTicket("first-line")}>First Line</button>
                <button className="btn btn-primary" onClick={() => claimTicket("second-line")}>Second Line</button>
                <button className="btn btn-primary" onClick={() => claimTicket("third-line")}>Third Line</button>
                <button className="btn btn-primary" onClick={() => claimTicket("house")}>House</button>
            </div>

        </>
    );
}