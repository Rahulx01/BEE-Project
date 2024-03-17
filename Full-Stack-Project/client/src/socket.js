import { io } from "socket.io-client";

const WS_URL = "ws://localhost:9000";

export const socket = io(WS_URL);
