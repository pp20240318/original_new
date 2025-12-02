import { EEmit, EGame, EOn } from "./enums";

declare global {
  /**
   * SocketOn Base Type
   */
  type SocketOn<E extends EOn, D = any> = [E, D];

  /**
   * SocketEmit Base Type
   */
  type SocketEmit<E extends [EEmit, ...any[]], D = any> = [
    E,
    {
      code: number;
      reactTo?: E[0];
      message?: string;
      data: D;
    }
  ];

  type OnError = SocketOn<EOn.ERROR, any>;

  type OnBalance = SocketOn<
    EOn.BALANCE,
    {
      balance: number;
      business_id: string;
      currency: string;
      debit: number;
      pay_out: null;
      typ: string;
    }
  >;

  type OnCircleResult = SocketOn<
    EOn.WS_CIRCLE_RESULT,
    {
      state: string;
      ship_id: string;
      data: {
        index: number;
        multiplier: number;
        num: number;
      };
    }
  >;

  type OnCircleStart = SocketOn<
    EOn.WS_CIRCLE_START,
    {
      state: string;
      ship_id: string;
      nextSettleTime: number;
      nowTime: number;
      countDown: number;
    }
  >;

  type EmitLogin = SocketEmit<
    [EEmit.LOGIN, { token: string; userId: string }],
    any
  >;

  type EmitSetNickName = SocketEmit<[EEmit.SETNICKNAME, { nickName: string }], any>

  type EmitCashout = SocketEmit<[EEmit.CASHOUT], any>;

  /**
   * Tower
   */
  type HistoryTower = SocketEmit<
    [EEmit.HISTORY, EGame.TOWER, Record<string, any>],
    any
  >;
  type StateTower = SocketEmit<
    [EEmit.STATE, EGame.TOWER, Record<string, any>],
    any
  >;

  type CashoutTower = SocketEmit<
    [EEmit.CASHOUT, EGame.TOWER, Record<string, any>],
    any
  >;
  type BetTower = SocketEmit<
    [
      EEmit.BET,
      EGame.TOWER,
      {
        bet_amount: number;
        bomb: number;
      }
    ],
    any
  >;
  type PlayTower = SocketEmit<
    [
      EEmit.PLAY,
      EGame.TOWER,
      {
        hit: number;
        position: number;
      }
    ],
    any
  >;

  type StateTower = SocketEmit<
    [EEmit.STATE, EGame.TOWER, Record<string, any>],
    {
      money: number; // 下注金额
      multiplier: number; // 当前倍率
      payout: number;
      bombNum: number; // 炸弹数量
      bombs: number[]; // 每层的炸弹位置数组
      positions: number[][]; // 每层历史点击位置 (?? 确认一下)
    }
  >;

  /**
   * Ring
   */
  type HistoryRing = SocketEmit<
    [EEmit.HISTORY, EGame.RING, Record<string, any>],
    any
  >;
  type BetRing = SocketEmit<
    [
      EEmit.BET,
      EGame.RING,
      {
        amount: number;
        risk: string; // 风险等级
        segments: number; // 分段数
      }
    ],
    any
  >;
  type BetRing = SocketEmit<
    [
      EEmit.BET,
      EGame.RING,
      {
        amount: number;
        risk: string; // 风险等级
        segments: number; // 分段数
      }
    ],
    any
  >;

  /**
   * Stairs
   */
  type HistoryStairs = SocketEmit<
    [EEmit.HISTORY, EGame.STAIRS, Record<string, any>],
    any
  >;
  type CashoutStairs = SocketEmit<
    [EEmit.CASHOUT, EGame.STAIRS, Record<string, any>],
    any
  >;
  type BetStairs = SocketEmit<
    [EEmit.BET, EGame.STAIRS, Record<string, any>],
    any
  >;

  type PlayStairs = SocketEmit<
    [EEmit.PLAY, EGame.STAIRS, Record<string, any>],
    any
  >;

  type StateStairs = SocketEmit<
    [EEmit.STATE, EGame.STAIRS, Record<string, any>],
    any
  >;

  /**
   * Circle
   */
  type HistoryCircle = SocketEmit<
    [EEmit.HISTORY, EGame.CIRCLE, Record<string, any>],
    any
  >;

  type BetCircle = SocketEmit<
    [
      EEmit.BET,
      EGame.CIRCLE,
      {
        ship_id: string;
        money: number;
        num: number;
      }
    ],
    any
  >;

  type HisResultsCricle = SocketEmit<
    [EEmit.HIS_RESULTS, EGame.CIRCLE, Record<string, any>],
    any
  >;

  type HistoryCircle = SocketEmit<
    [EEmit.HISTORY, EGame.CIRCLE, Record<string, any>],
    any
  >;

  /**
   * Hilo
   */
  type HistoryHilo = SocketEmit<
    [EEmit.HISTORY, EGame.HILO, Record<string, any>],
    any
  >;
  type CashoutHilo = SocketEmit<
    [EEmit.CASHOUT, EGame.HILO, Record<string, any>],
    any
  >;
  type BetHilo = SocketEmit<
    [EEmit.BET, EGame.HILO, Record<string, any>],
    any
  >;

  type PlayHilo = SocketEmit<
    [EEmit.PLAY, EGame.HILO, Record<string, any>],
    any
  >;

  type StateHilo = SocketEmit<
    [EEmit.STATE, EGame.HILO, Record<string, any>],
    any
  >;

  /**
 * CoinRecordHolder
 */
  type HistoryCoinRecordHolder = SocketEmit<
    [EEmit.HISTORY, EGame.COINRECORDHOLDER, Record<string, any>],
    any
  >;
  type StateCoinRecordHolder = SocketEmit<
    [EEmit.STATE, EGame.COINRECORDHOLDER, Record<string, any>],
    any
  >;

  type CashoutCoinRecordHolder = SocketEmit<
    [EEmit.CASHOUT, EGame.COINRECORDHOLDER, Record<string, any>],
    any
  >;
  type BetCoinRecordHolder = SocketEmit<
    [
      EEmit.BET,
      EGame.COINRECORDHOLDER,
      {
        bet_amount: number;
      }
    ],
    any
  >;
  type PlayCoinRecordHolder = SocketEmit<
    [
      EEmit.PLAY,
      EGame.COINRECORDHOLDER,
      {
        hit: number;
      }
    ],
    any
  >;

  type StateCoinRecordHolder = SocketEmit<
    [EEmit.STATE, EGame.TOWER, Record<string, any>],
    {
      money: number; // 下注金额
      multiplier: number; // 当前倍率
      payout: number;
      hit: number; // 连击次数
      nickName: string;
      hasStart: boolean;
    }
  >;
}

export { };
