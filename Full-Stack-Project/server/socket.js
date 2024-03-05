import { Server } from "socket.io";
import { joinRoom } from "./controllers/RoomController.js";
import jwt from "jsonwebtoken";
import { roomBoardNumbers } from "./index.js";

const io = new Server(9000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("a user connected lol", socket.id);

  // When user join room
  socket.on("join-room", (roomCode, JWtoken) => {
    handleJoinRoom(roomCode, JWtoken, socket);
  });

  //Get Ticket
  socket.on("get-ticket", () => {
    const ticket = getTicket();
    const signedTicket = jwt.sign({ ticket: ticket }, "THISISMYSECRETKEYFORSIGNINGTICKET");
    socket.emit("ticket", ticket, signedTicket);
  });

  //Claim Ticket
  socket.on("claim-ticket", (claimType, signedTicket, roomCode, JWtoken) => {
    const username = claimTicket(claimType, signedTicket, JWtoken, roomCode);
    if (username) {
      console.log('Claiming Ticket');
      socket.emit("claim-ticket", claimType);
      socket.to(roomCode).emit("claim-ticket", claimType, username);
    }
    else {
      // socket.emit("bogey", claimType);
      socket.to(roomCode).emit("bogey", claimType, username);
    }
  });

  //when user send chat message
  socket.on("room-chat-message", (roomCode, message) => {
    console.log("This is the message", message, roomCode);
    socket.to(roomCode).emit("room-chat-message", message);
  });
});

function claimTicket(claimType, signedTicket, JWtoken, roomCode) {
  const username = tokenAuthentication(JWtoken);
  const ticket = ticketAuthentication(signedTicket).ticket;
  const board = roomBoardNumbers.get(roomCode);
  if (username && ticket && board) {
    if (claimType == 'first-line') {
      for (let i = 0; i < 9; i++) {
        if (ticket[0][i] && board.has(ticket[0][i])) return false;
      }
    }
    else if (claimType == 'second-line') {
      for (let i = 0; i < 9; i++) {
        if (ticket[1][i] && board.has(ticket[1][i])) return false;
      }
    }
    else if (claimType == 'third-line') {
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
    return username;
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
    console.log("new user", username);
    joinRoom(roomCode, username)
      .then((roomDetails) => {
        if (roomDetails) {
          socket.join(roomCode);
          socket.emit("room-join-success", roomDetails.host, roomDetails.members);
          socket.to(roomCode).emit("new-user", `${username} joined the room`);
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
