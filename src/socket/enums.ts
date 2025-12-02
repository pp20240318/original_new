export enum EEmit {
  LOGIN = "login",
  SETNICKNAME = "setNickName",
  BET = "bet",
  PLAY = "play",
  STATE = "state",
  CASHOUT = "cashout",
  HISTORY = "history",
  HIS_RESULTS = "hisResults",
}

export enum EGame {
  TOWER = "tower",
  STAIRS = "stairs",
  RING = "ring",
  CIRCLE = "circle",
  HILO = "hilo",
  COINRECORDHOLDER = "coinrecordholder",
}

/**
 * 使用原生WebSocket的情况:
 * 1. 枚举值以"_"分割
 * 2. 枚举值第一段以"ws"开头
 * 3. 枚举值第二段指定游戏名
 * 4. 枚举值第三段指定事件名
 */
export enum EOn {
  ERROR = "error",
  BALANCE = "balance",
  WS_CIRCLE_RESULT = "ws_circle_result",
  WS_CIRCLE_START = "ws_circle_start",
}
