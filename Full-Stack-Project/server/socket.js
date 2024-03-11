import { Server } from "socket.io";
import { joinRoom } from "./controllers/RoomController.js";
import jwt from "jsonwebtoken";
import { roomStateMap } from "./index.js";

const io = new Server(9000, {
  cors: {
    origin: ["http://localhost:3000", "https://online-tambola.vercel.app/"],
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("a user connected lol", socket.id);

  // When user join room
  socket.on("join-room", (roomCode, JWtoken) => {
    console.log("This is from room ", socket.rooms.size);
    if (socket.rooms.size > 1) return;
    handleJoinRoom(roomCode, JWtoken, socket);
  });

  //leave room
  socket.on("leave-room", (roomCode, JWtoken) => {
    const username = tokenAuthentication(JWtoken);
    console.log(username)
    if (username) {
      socket.leave(roomCode);
      socket.to(roomCode).emit("user-left", username);
    }
  });

  // Start Game
  socket.on("game-status", (roomCode, gameActiveStatus, JWtoken) => {
    const username = tokenAuthentication(JWtoken);
    console.log(username);
    if (username) {
      const room = roomStateMap.get(roomCode);
      if (room && room.host === username) {
        console.log("game status changed");
        room.roomActiveStatus = gameActiveStatus;
        roomStateMap.set(roomCode, room);
        socket.to(roomCode).emit("game-status", gameActiveStatus);
      }
    }
  });

  //Get Ticket
  socket.on("get-ticket", () => {
    const ticket = getTicket();
    const signedTicket = jwt.sign({ ticket: ticket }, "THISISMYSECRETKEYFORSIGNINGTICKET");
    socket.emit("ticket", ticket, signedTicket);
  });

  //Claim Ticket
  socket.on("claim-ticket", (claimType, signedTicket, roomCode, JWtoken) => {

    const username = tokenAuthentication(JWtoken);

    if (username) {
      if (!claimTicket(claimType, signedTicket, JWtoken, roomCode)) {
        io.to(roomCode).emit("claim-ticket", claimType, username);
      }
      else {
        io.to(roomCode).emit("bogey", claimType, username);
      }
    }
  });

  //when user send chat message
  socket.on("room-chat-message", (roomCode, message, JWtoken) => {
    const username = tokenAuthentication(JWtoken);
    if (username) socket.to(roomCode).emit("room-chat-message", username, message);
  });

  //when user disconnect
  socket.on("disconnect", () => {
    // const roomCode = Array.from(socket.rooms).find((room) => room !== socket.id);
    // socket.to(roomCode).emit("user-left", username);
    console.log("user disconnected");

  });
});

function claimTicket(claimType, signedTicket, roomCode) {
  const ticket = ticketAuthentication(signedTicket).ticket;
  const board = roomStateMap.get(roomCode)?.boardNumbers;
  if (ticket && board) {
    if (claimType == 'firstLine') {
      for (let i = 0; i < 9; i++) {
        if (ticket[0][i] && board.has(ticket[0][i])) return false;
      }
    }
    else if (claimType == 'secondLine') {
      for (let i = 0; i < 9; i++) {
        if (ticket[1][i] && board.has(ticket[1][i])) return false;
      }
    }
    else if (claimType == 'thirdLine') {
      for (let i = 0; i < 9; i++) {
        if (ticket[2][i] && board.has(ticket[2][i])) return false;
      }
    }
    else if (claimType == 'house') {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
          if (ticket[i][j] && board.has(ticket[i][j])) return false;
        }
      }
    }
    return true;
  }
  else return false;
}

function getTicket() {
  const ticket = new Array(3).fill(null).map(col => new Array(9).fill(null));
  for (let i = 0; i < 9; i++) {
    const randomRow = Math.floor(Math.random() * 3);
    ticket[randomRow][i] = Math.floor(Math.random() * 10) + i * 10 + 1;
  }
  for (let i = 0; i < 6; i++) {
    let number = undefined;
    while (!number) {
      number = Math.floor(Math.random() * 10) + i * 10 + 1;
    }
  }
  return ticket;
}

function handleJoinRoom(roomCode, JWtoken, socket) {
  const username = tokenAuthentication(JWtoken);
  if (username) {
    joinRoom(roomCode, username)
      .then((roomDetails) => {
        if (roomDetails) {
          console.log("room join success");
          socket.join(roomCode);
          socket.emit("room-join-success", username == roomDetails.host, roomDetails.members);
          socket.to(roomCode).emit("new-user", username);
        }
        else socket.emit("room-join-failed");
      })
      .catch((e) => socket.emit("room-join-failed"));
  } else socket.emit("room-join-failed");
}

function tokenAuthentication(JWtoken) {
  try {
    const user = jwt.verify(JWtoken, "THISISMYSECRETKEYFORMYSECRETPROJECT");
    return user?.username;
  } catch (err) {
    console.log(err);
    return false;
  }
}

function ticketAuthentication(signedTicket) {
  try {
    const ticket = jwt.verify(signedTicket, "THISISMYSECRETKEYFORSIGNINGTICKET");
    return ticket;
  }
  catch (err) {
    // console.log(err);
    return false;
  }
}

export default io;
