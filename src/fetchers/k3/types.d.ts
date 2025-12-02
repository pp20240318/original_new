
interface K3BollOdd {
    Gameplay: string;
    ball: string;
    odd: number;
}

interface DReust<T> {
    code: number;
    msg: string;
    data: T;
}

interface DReustList<T> {
    code: number;
    msg: string;
    data: T[];
}

interface DThreeKingHistory {
    list: ThreeKingHistoryItem[];
    totalPage: number
}
interface ThreeKingHistoryItem {
    opendate: string;
    num1: number;
    num2: number;
    num3: number;
    total: number;
    bigOrSmall: ThreeKingHistoryBigOrSmall;
    oddOrEven: ThreeKingHistoryOddOrEven;
    description: ThreeKingHistoryDescription;
}

enum ThreeKingHistoryBigOrSmall {
    Big = "Big",
    Small = "Small",
}

enum ThreeKingHistoryDescription {
    The2SameNumbers = "2 same numbers",
    The3ConsecutiveNumbers = "3 consecutive numbers",
    The3DifferentNumbers = "3 different numbers",
}

enum ThreeKingHistoryOddOrEven {
    Even = "Even",
    Odd = "Odd",
}

interface IThreeKingHistory {
    minute: number;
    pageSize: number;
    pageIndex: number;
}
interface ICurrentThreeKingData {
    minute: number;
}

interface DCurrentThreeKingData {
    opendate: string;
    seconds: number;
    items: CurrentThreeKingDataItem[];
}
interface CurrentThreeKingDataItem {
    type: string;
    value: string;
    rate: number;
}

interface IThreeKingBet {
    minute: number;
    content:string;
    money:number;
}
interface DThreeKingBet {
    minute: number;
    content:string;
    money:number;
}

interface IMyThreeKingHistory {
    minute: number;
    pageSize: number;
    pageIndex: number;
}

interface DMyThreeKingHistory {
    list:      MyThreeKingHistoryItem[];
    totalPage: number;
}

interface MyThreeKingHistoryItem {
    opendate:   string;
    money:      number;
    winMoney:   number;
    status:     number;
    createTime: Date;
    content:    string;
    sid:        string;
    result:     string;
    showDetail: boolean;
}

interface DGetCurrentThreeKingResult {
    opendate:   string;
    result:     string;
    winAmount:  number;
    bigOrSmall: string;
    oddOrEven:  string;
}