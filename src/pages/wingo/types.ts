export enum WinGoGameCodeEnum {
  ONE = "ffssc",
  THREE = "sfssc",
  FIVE = "ffc",
}

export type WinGoBetType = "group" | "number";

export type WinGoBetName =
  | "red"
  | "green"
  | "violet"
  | "big"
  | "small"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

export interface WinGoOpenInfoData {
  GameType: string;
  DropDate: string;
  IsOpen: boolean;
  CloseTime: string;
  CloseSecond: number;
  BetDropDate: string;
  GameIcon: string;
}

export interface WinGoOddsParm {
  GameType: string;
  WF: string;
}

export interface WinGoOddsData {
  num: WinGoBetName;
  rate: string;
  tp: string;
  tp2: string;
  tp3: string;
  rateCondition: string; // "[{\"min\":\"0\",\"max\":\"10000\",\"value\":\"0\"},{\"min\":\"10000\",\"max\":\"50000\",\"value\":\"0\"},{\"min\":\"50000\",\"max\":\"100000\",\"value\":\"0\"}]",
  low_limit: number;
  pour_limit: string;
  unit_limit: string;
  pour_limit1: string;
  Max_PayOut: string;
}

export interface WinGoLatestResultData {
  ID: number;
  dates: string;
  num1: string;
  num2: string;
  num3: string;
  num4: string;
  num5: string;
  sign: null;
  open_date: string;
  opens: null;
  deleted: null;
  drop_time: string;
  checkout: null;
  bsghs: null;
  qskd: string;
  zskd: string;
  hskd: string;
  wdx: string;
  wds: string;
  wzh: string;
  qdx: string;
  qds: string;
  qzh: string;
  bdx: string;
  bds: string;
  bzh: string;
  sdx: string;
  sds: string;
  szh: string;
  gdx: string;
  gds: string;
  gzh: string;
  wqhs: string;
  wbhs: string;
  wshs: string;
  wghs: string;
  qbhs: string;
  qshs: string;
  qghs: string;
  bshs: string;
  bghs: string;
  sghs: string;
  dragon1vstiger2: string;
  dragon1vstiger3: string;
  dragon1vstiger4: string;
  dragon1vstiger5: string;
  dragon2vstiger3: string;
  dragon2vstiger4: string;
  dragon2vstiger5: string;
  dragon3vstiger4: string;
  dragon3vstiger5: string;
  dragon4vstiger5: string;
  zhdx: string;
  zhds: string;
  qszhs: string;
  zszhs: string;
  hszhs: string;
  qsdx: string;
  zsdx: string;
  hsdx: string;
  qsds: string;
  zsds: string;
  hsds: string;
  qszh: string;
  zszh: string;
  hszh: string;
  settledflag: null;
  DropDate: string;
  BetDropDate: string;
  GameIcon: string;
  GroupType: string;
}

export interface WinGoGameHistoryParm {
  type: string;
  size: number;
  pageIndex: number;
}

export interface WinGoGameHistoryData {
  lotteryType: string;
  stage: number;
  formatStage: null;
  result: string;
  sxResult: string;
  openDate: string;
  drop_time: null;
}

export interface WinGoGameHistory {
  period: number;
  price: string;
  number: number;
  size: "big" | "small";
  color: ("red" | "green" | "violet")[];
}

export interface WinGoBetHistoryParm {
  type: string;
  state?: WinGoBetStateEnum;
  pageCurrent: number;
  pageSize: number;
}

export enum WinGoBetStateEnum {
  Pending = 0,
  Success = 1,
  Fail = 2,
  Reverse = 3,
}

export interface WinGoBetHistoryData {
  ID: number;
  drop_type: string;
  drop_content: string;
  // max_agent: null;
  // drop_max_agent_cut: null;
  // drop_date: string;
  // open_date: string;
  // drop_tm: null;
  drop_rate: string;
  // drop_cut: number;
  // drop_plate: string;
  // cut_sign: null;
  drop_money: number;
  drop_details: null;
  fee: string;
  sign: null;
  num_sign: null;
  num_id: string;
  drop_time: string | any;

  delivery: string;
  status: string;

  lotteryType: string;

  stage: string;
  amount: null | number;
  num1: string; //开奖号码
}

export interface WinGoOdds {
  numbers: WinGoOddsData[];
  colors: WinGoOddsData[];
  sizes: WinGoOddsData[];
}

export interface WinGoBetHistory {
  orderId: string;
  period: string;
  contractMoney: string;
  result: WinGoBetName[] | string;
  select: WinGoBetName;
  status: "pending" | "succeed" | "failed" | "revoked";
  amount: string;
  rate: string;
  createTime: string;
  showDetail: boolean;
  fee: number;
}

export interface WinGoBetParm {
  GameType: string;
  Content: string;
}

export interface WinGoUserProfitByIssueParm {
  GameType: string;
  DropDate: string;
}
