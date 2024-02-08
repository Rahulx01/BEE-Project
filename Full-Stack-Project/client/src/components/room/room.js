import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';

export default () => {
    const { roomCode } = useParams();
    useEffect(() => {
        console.log(roomCode);
    }, [roomCode]);
    return (
        <>
            <h1>hello is this root room {roomCode}</h1>
        </>
    )
}