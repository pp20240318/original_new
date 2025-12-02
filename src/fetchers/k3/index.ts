import { get, post } from "../fetch";

export function getThreeKingHistory(data: IThreeKingHistory){
  return get<DReust<DThreeKingHistory>>("/a6/game/GetThreeKingHistory", { data });
};

export function getCurrentThreeKingData(data: ICurrentThreeKingData){
  return get<DReust<DCurrentThreeKingData>>("/a6/game/GetCurrentThreeKingData", { data });
};

export function threeKingBet(data: IThreeKingBet){
  return post<DReust<DThreeKingBet>>("/a6/game/ThreeKingBet", { data });
};

export function myThreeKingHistory(data: IMyThreeKingHistory){
  return get<DReust<DMyThreeKingHistory>>("/a6/game/GetMyThreeKingHistory", { data });
};

export function getCurrentThreeKingResult(data:{opendate:string}){
  return get<DReust<DGetCurrentThreeKingResult>>("/a6/game/GetCurrentThreeKingResult", { data });
};

export function createToken(data:{agentId:string,account:string}){
  const { agentId, account } = data;
  const params = new URLSearchParams({ agentId, account }).toString();
  return post<string>(`/a6/test/CreateToken?${params}`);
};
