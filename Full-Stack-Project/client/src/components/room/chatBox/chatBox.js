import React from 'react';
import './chatbox.css';

export default () => {
    const handleSendMessage = () => {
        const message = document.getElementById('chatInput').value;
        if(!message) return;
        //  const newMsg = document.createElement
        console.log(message);
    };

    return (
        <div className='chat-container'>
            <div id='chat-messages'></div>
            <div className='message-input-container'>
                <input
                    type='text'
                    placeholder='Type your message'
                    id='chatInput'
                />
                <button
                    className='btn btn-secondary'
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
