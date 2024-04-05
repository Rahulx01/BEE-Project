import React, { useState, useEffect } from 'react';
import Ticket from './tambolaTicket';
import { socket } from '../../../socket';
import { toast } from 'react-toastify';

const GameSection = (props) => {
    const roomCode = props.roomDetails?.roomCode;
    const [ticket, setTicket] = useState(null);
    const [signedTicket, setSignedTicket] = useState(null);
    const [claimTypes, setClaimTypes] = useState({ firstLine: false, secondLine: false, thirdLine: false, house: false });
    const [prevNumber, setPrevNumber] = useState(false);

    const claimTicket = (claimType) => {
        socket.emit('claim-ticket', claimType, signedTicket, roomCode);
    };

    const handleTicketUpdate = (ticket, signedTicket) => {
        setTicket(ticket);
        setSignedTicket(signedTicket);
    };

    const handleClaimUpdate = (claimType, username) => {
        setClaimTypes(prevClaimTypes => ({
            ...prevClaimTypes,
            [claimType]: username
        }));
    };

    const handleBogey = (claimType, username) => {
        console.log(claimType);
        toast.error(`${username} has claimed ${claimType}`);
    };

    useEffect(() => {
        console.log("Ststus is ", props.roomDetails.isHost);
        const intervalId = props.roomDetails.isHost ?
            (setInterval(() => {
                console.log("Interval is running", props.roomDetails.isHost);
                socket.emit("get-new-number", roomCode);
            }, 5000)) : null;

        socket.emit('get-ticket');

        const onTicketUpdate = (ticket, signedTicket) => handleTicketUpdate(ticket, signedTicket);
        const onClaimUpdate = (claimType, username) => handleClaimUpdate(claimType, username);
        const onBogey = (claimType, username) => handleBogey(claimType, username);

        socket.on('ticket', onTicketUpdate);
        socket.on('claim-ticket', onClaimUpdate);
        socket.on('bogey', onBogey);
        socket.on('new-number', (number) => {
            setPrevNumber(number);
        });

        return () => {
            // Clean up event listeners
            clearInterval(intervalId);
            socket.off('ticket', onTicketUpdate);
            socket.off('claim-ticket', onClaimUpdate);
            socket.off('bogey', onBogey);
            socket.off('new-number');
        };
    }, []);

    return (
        <>
            <div className="d-flex flex-column align-items-center mb-4">
                <p>New number will show here</p>
                <div className="d-flex justify-content-center align-items-center border border-black" style={{ height: "80px", width: "80px" }}>
                    <h1>{prevNumber}</h1>
                </div>
            </div>

            <div className="mb-4 d-flex justify-content-center" >
                <Ticket ticket={ticket}></Ticket>
            </div>

            <div className="mb-4">
                <div className="d-flex justify-content-around">
                    {!claimTypes.firstLine && (<button className="btn btn-success" onClick={() => claimTicket("firstLine")}>First Line</button>)}
                    {!claimTypes.secondLine && (<button className="btn btn-success" onClick={() => claimTicket("secondLine")}>Second Line</button>)}
                    {!claimTypes.thirdLine && (<button className="btn btn-success" onClick={() => claimTicket("thirdLine")}>Third Line</button>)}
                    {!claimTypes.house && (<button className="btn btn-success" onClick={() => claimTicket("house")}>House</button>)}
                </div>
            </div>

            <div>
                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th>Awards</th>
                            <th>Won by</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>First Line</td>
                            <td>{claimTypes?.firstLine}</td>
                        </tr>
                        <tr>
                            <td>Second Line</td>
                            <td>{claimTypes?.secondLine}</td>
                        </tr>
                        <tr>
                            <td>Third Line</td>
                            <td>{claimTypes?.thirdLine}</td>
                        </tr>
                        <tr>
                            <td>House</td>
                            <td>{claimTypes?.house}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>


    );
};

export default GameSection;
