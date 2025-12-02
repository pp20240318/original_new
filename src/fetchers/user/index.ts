import { get, post } from "../fetch";
export const accountInfo = () => {
  return get<DAccountInfo>("/api/user/account_info");
};

export const ownGames = () => {
  return get<DOwnGames>("/api/user/own_games");
};

export const getBalance = () => {
  return get<ResData<{ data: { balance: number } }>>("a6/user/GetBalance");
};
