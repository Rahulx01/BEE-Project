import React, { useEffect } from 'react';

export default function PublicRooms() {
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        // Fetch all public rooms
        // fetch()
        // Set the rooms to the state
    }, [])
    return (
        <div>
            <h1>Public Rooms</h1>
        </div>
    );
}