import { useEffect } from "react";
import { initializeSocket, getSocket } from "@/utils/socket";

export const useSocket = (event: string, callback: (data: any) => void) => {
  useEffect(() => {
    const socket = initializeSocket();

    // 监听指定事件
    socket.on(event, callback);

    // 清理事件监听
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};

export const emitSocketGameEvent = (
  event: string,
  data: any,
  type: string,
  cb: (r: any) => void
) => {
  const socket = getSocket();
  console.log("socket data", data);
  socket.emit(event, type, data, cb);
};

export const emitSocketEvent = (event: string, data: any) => {
  const socket = getSocket();
  socket.emit(event, data);
};
