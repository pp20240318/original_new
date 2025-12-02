interface WebSocketItem {
  webSocket: WebSocket;
  listeners: Map<string, ((data: any) => void)[]>;
  reconnectAttempts: number;
  heartbeat?: NodeJS.Timeout;
}

const webSockets = new Map<string, WebSocketItem>();

const MAX_RECONNECT_ATTEMPTS = 5;
const HEARTBEAT_INTERVAL = 30_000;

const getWebSocket = (url: string): WebSocket => {
  if (!webSockets.has(url) || webSockets.get(url)!.webSocket.readyState >= 2) {
    initWebSocket(url);
  }
  return webSockets.get(url)!.webSocket;
};

const initWebSocket = (url: string) => {
  const webSocket = new WebSocket(url);

  webSocket.binaryType = "blob";

  const webSocketItem: WebSocketItem = {
    webSocket,
    listeners: new Map(),
    reconnectAttempts: 0,
  };

  webSockets.set(url, webSocketItem);

  const startHeartbeat = () => {
    stopHeartbeat();
    webSocketItem.heartbeat = setInterval(() => {
      if (webSocket.readyState !== WebSocket.OPEN) return;
      webSocket.send(JSON.stringify({ type: "ping", payload: Date.now() }));
    }, HEARTBEAT_INTERVAL);
  };

  const stopHeartbeat = () => {
    if (!webSocketItem.heartbeat) return;
    clearInterval(webSocketItem.heartbeat);
    delete webSocketItem.heartbeat;
  };

  webSocket.onopen = () => {
    console.log(`[WebSocket] Connected to ${url}`);
    webSocketItem.reconnectAttempts = 0;
    startHeartbeat();
  };

  webSocket.onclose = () => {
    console.warn(`[WebSocket] Disconnected from ${url}`);
    stopHeartbeat();
    attemptReconnect(url);
  };

  webSocket.onerror = (err) => {
    console.error(`[WebSocket] Error: ${err}`);
    webSocket.close(); // 触发 onclose 逻辑
  };

  webSocket.onmessage = async ({ data }) => {
    try {
      if (data instanceof Blob) data = await data.text();
      const message = JSON.parse(data);
      const handlers = webSocketItem.listeners.get(message?.state || "default");
      handlers?.forEach((handler) => handler(message));
    } catch (err) {
      console.error(`[WebSocket] Failed to parse message: ${data}`, err);
    }
  };
};

const attemptReconnect = (url: string) => {
  const webSocketItem = webSockets.get(url);

  if (!webSocketItem) return;

  if (webSocketItem.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    webSocketItem.reconnectAttempts++;
    setTimeout(() => {
      console.log(
        `[WebSocket] Reconnecting to ${url} (Attempt ${webSocketItem.reconnectAttempts})`
      );
      initWebSocket(url);
    }, 3000);
  } else {
    console.error(`[WebSocket] Max reconnect attempts reached for ${url}`);
  }
};

const webSocketOn = (
  url: string,
  event: string,
  handler: (data: any) => void
) => {
  getWebSocket(url);
  const webSocketItem = webSockets.get(url)!;
  const handlers = webSocketItem.listeners.get(event) || [];
  webSocketItem.listeners.set(event, [...handlers, handler]);
};

const webSocketOff = (
  url: string,
  event: string,
  handler: (data: any) => void
) => {
  const webSocketItem = webSockets.get(url);
  if (!webSocketItem) return;
  const handlers = webSocketItem.listeners.get(event) || [];
  webSocketItem.listeners.set(
    event,
    handlers.filter((h) => h !== handler)
  );
};

export { getWebSocket, webSocketOn, webSocketOff };
