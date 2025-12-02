import { io } from "socket.io-client";
import { EOn } from "./enums";
import { getSession } from "@/utils/sessionStorage";
import { emitError, emitLogined, emitSocketBalance } from "@/events";

const { token, userId } = getSession<InitParams>("initparams") ?? {};

const socketIO = io(import.meta.env.VITE_WSS_BASE_URL, {
  path: "/game-service/socket.io",
  auth: { token, userId },
  extraHeaders: { Authorization: `Bearer ${token}` },
});

socketIO.on("connect", () => {
  console.log(
    `%cSocket connected: ${socketIO.id}`,
    "color: white; font-size: 16px; font-weight: bold; padding: 2px 10px; border-radius: 4px; background: green"
  );

  const { engine } = socketIO.io;

  console.log("engine:", engine.transport.name);

  engine.once("upgrade", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    if (token && userId) {
      socketIO.emit("login", { token, userId }, (res: any) => {
        if (res.code === 200) emitLogined(true);
      });
    }
  });

  engine.on("packet", (packet) => {
    // called for each packet received
  });

  engine.on("packetCreate", (packet) => {
    // called for each packet sent
  });

  engine.on("drain", () => {
    // called when the write buffer is drained
  });

  engine.on("close", (reason) => {
    // called when the underlying connection is closed
  });
});

socketIO.io.on("reconnect_attempt", () => {
  // ...
});

socketIO.io.on("reconnect", () => {
  // ...
});

socketIO.on("connect_error", () => {
  // ...
});

socketIO.on("disconnect", (reason) => {
  console.log(
    `%cSocket disconnected: ${reason}`,
    "color: white; font-size: 16px; font-weight: bold; padding: 2px 10px; border-radius: 4px; background: red"
  );
});

/**
 * 自定义事件监听
 */
socketIO.on(EOn.ERROR, (err) => {
  console.error(err);
  emitError({ from: "socket", error: err });
});

socketIO.on(EOn.BALANCE, (res) => {
  emitSocketBalance(res);
});

export { socketIO };
