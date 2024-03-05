import { io } from "socket.io-client";

const WS_URL = "ws://localhost:9000";
console.log("This is form socket file");

export const socket = io(WS_URL);
