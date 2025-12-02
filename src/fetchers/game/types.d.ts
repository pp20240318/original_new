interface IRacingData {
  minute?: number;
  opendate?: string;
}

interface DRacingData {
  opendate: string;
  realOpendate: string;
  seconds: number;
  items: RacingBetItem[];
  openResult: {
    bigOrSmall: string;
    oddOrEven: string;
    opendate: string;
    results: string;
    total: number;
  };
}

interface DRacingResult {
  opendate: string;
  results: string;
  total: number;
  bigOrSmall: string;
  oddOrEven: string;
  winAmount: number;
}

interface RacingBetItem {
  type: string;
  value: string;
  rate: number;
}

interface PRacingBet extends IRacingData {
  content: string;
  money: number;
}

interface PHistoryData {
  minute: number;
  pageIndex: number;
  pageSize: number;
}

interface DHistoryData {
  list: DHistoryDataList[];
  totalPage: number;
}
interface DHistoryDataList {
  opendate: string;
  results: string;
  total: number;
  bigOrSmall: string;
  oddOrEven: string;
}

interface DMyHistoryData {
  list: DMyHistoryDataList[];
  totalPage: number;
}

interface DMyHistoryDataList {
  opendate: string;
  money: number;
  winMoney: number;
  status: number;
  createTime: Date;
  content: string;
  sid: string;
  result: string;
  originalMoney: number;
}

interface DGetFiveDragonHistory {
  list: DGetFiveDragonHistoryItem[];
  totalPage: number;
}
interface DGetFiveDragonHistoryItem {
  opendate: string;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  total: number;
  bigOrSmall: string;
  oddOrEven: string;
}

interface DGetMyFiveDragonHistory {
  list: DGetMyFiveDragonHistoryItem[];
  totalPage: number;
}
interface DGetMyFiveDragonHistoryItem {
  opendate: string;
  money: number;
  winMoney: number;
  status: number;
  createTime: Date;
  content: string;
  sid: string;
  result: string;
  originalMoney: number;
}

interface DTowerHistory {
  createTime: string;
  money: string;
  result: string;
  sid: string;
  uid: string;
  winMoney: string;
}

interface DStairsHistory {
  createTime: string;
  money: string;
  result: string;
  sid: string;
  uid: string;
  winMoney: string;
}