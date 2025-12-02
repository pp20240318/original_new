export enum K3Gameplay {
  total = "total",
  same2 = "same2",
  same3 = "same3",
  different = "different",
}
export enum K3GameCodeEnum {
  ONE = "k3-1",
  THREE = "k3-3",
  FIVE = "k3-5",
  TEN = "k3-10",
}
// export enum K3CodeEnum {
//   ONE = "ffssc",
//   THREE = "sfssc",
//   FIVE = "ffc",
// }

export enum bigOrSmallTypes {
  Big = "Big",
  Small = "Small",

}

export enum oddOrEvenTypes {
  Odd = "Odd",
  Even = "Even",
}

export interface K3OddsData {
  type: string;
  value: string[];
}
export interface K3BetData {
  type: string;
  value: string;
}
export type K3BetName =
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
export interface K3GameHistoryParm {
  type: string;
  size: number;
  pageIndex: number;
}

export interface K3GameHistoryData {
  lotteryType: string;
  stage: number;
  formatStage: null;
  result: string;
  sxResult: string;
  openDate: string;
  drop_time: null;
}

export interface K3GameHistoryItem {
  period: string;
  price: string;
  number: number;
  size: "big" | "small";
  color: ("red" | "green" | "violet")[];
}
export enum K3BetType {
  Total = "Total",
  BigOrSmall = "BigOrSmall",
  OddOrEven = "OddOrEven",
  TwoSame = "TwoSame",
  TwoSameWithSingle = "TwoSameWithSingle",
  TwoSameWithSingleB = "TwoSameWithSingleB",
  ThreeSame = "ThreeSame",
  AnyThreeSame = "AnyThreeSame",
  ThreeDifferent = "ThreeDifferent",
  Continuous = "Continuous",
  TwoDifferent = "TwoDifferent",
}

export interface K3BetShow {
  title: string;
  content: string;
}
export interface K3BetHistory {
  orderId: string;
  period: string;
  contractMoney: string;
  result: string;
  select: string;
  status: "pending" | "succeed" | "failed" | "revoked";
  amount: string;
  rate: string;
  createTime: string;
  showDetail: boolean;
  fee: number;
}

export interface K3BetHistoryData {
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
  drop_time: string;

  delivery: string;
  status: string;

  lotteryType: string;



  stage: string;
  amount: null | number;
  num1: string; //开奖号码
}

