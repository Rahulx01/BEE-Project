import React from 'react';
import Ticket from './tambolaTicket/ticket';
import ChatBox from './chatBox/chatBox';
export default () => {
    return (
        <>
            <div className="container" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="col-md-6">
                    <Ticket />
                </div>
                <div className="col-md-6 ml-6">
                    <ChatBox />
                </div>
            </div>

        </>
    )
}