import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // or your deployed backend
export default socket;
