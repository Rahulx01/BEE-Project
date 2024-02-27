import { Server } from 'socket.io';

export default (activeRoom) => {
    const io = new Server(9000, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    
    });
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });
}

/*

        console.log("The rooms are", activeRoom);
        socket.on('join-room', (roomCode) => {
            // activeRoom.push(roomCode);
            console.log("Room joined", roomCode,activeRoom);
            socket.emit('new-user', "hello this is new user");
            socket.join(roomCode);
        });
        socket.on('disconnect', () => {
            // activeRoom.pop(roomCode)
            console.log('user disconnected');
        });
*/