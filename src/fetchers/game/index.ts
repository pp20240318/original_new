import { get, post } from "../fetch";

export const getRacingData = (data: IRacingData) => {
  return get<ResData<{ data: DRacingData }>>(
    "/a6/game/GetCurrentRoyalRacingData",
    {
      data,
    }
  );
};

export const getRacingResult = (data: IRacingData) => {
  return get<ResData<{ data: DRacingResult }>>(
    "/a6/game/GetCurrentRoyalRacingResult",
    {
      data,
    }
  );
};

export const getRoyalRacingHistory = (data: PHistoryData) => {
  return get<ResData<{ data: DHistoryData }>>(
    "/a6/game/GetRoyalRacingHistory",
    { data }
  );
};

export const getMyRoyalRacingHistory = (data: PHistoryData) => {
  return get<ResData<{ data: DMyHistoryData }>>(
    "/a6/game/GetMyRoyalRacingHistory",
    { data }
  );
};

export const RacingBet = (data: PRacingBet) => {
  return post<ResData<{ data: any }>>("/a6/game/RoyalRacingBet", {
    data,
  });
};

// 获取5D数据
export const get5dData = (data: IRacingData) => {
  return get<ResData<{ data: DRacingData }>>(
    "/a6/game/GetCurrentFiveDragonData",
    {
      data,
    }
  );
};

// 获取5D开奖结果
export const get5dResult = (data: IRacingData) => {
  return get<ResData<{ data: DRacingResult }>>(
    "/a6/game/GetCurrentFiveDragonResult",
    {
      data,
    }
  );
};
//5D历史开奖记录
export const getCurrentFiveDragonResult = (data: PHistoryData) => {
  return get<ResData<{ data: DGetFiveDragonHistory }>>(
    "/a6/game/GetFiveDragonHistory",
    {
      data,
    }
  );
};
//5D我的购票记录
export const getMyFiveDragonHistory = (data: PHistoryData) => {
  return get<ResData<{ data: DGetMyFiveDragonHistory }>>("/a6/game/GetMyFiveDragonHistory", {
    data,
  });
};
//【5D】下注
export const FiveDragonBet = (data: PRacingBet) => {
  return post<ResData<{ data: any }>>("/a6/game/FiveDragonBet", {
    data,
  });
};
