import { io, Socket } from "socket.io-client";

const host = "wss://inhouse.xoxbrwin.com";

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(host, {
      path: "/game-service/socket.io",
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // 添加全局事件监听
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    // ...existing code...
    socket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err.message);
    });
    // ...existing code...
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket is not initialized. Call initializeSocket first.");
  }
  return socket;
};
