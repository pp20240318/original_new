import { get, post } from "../fetch";
export const getGuesses = (data: IGuesses) => {
  return get<DGuesses>("/api/win/guesses", { data });
};
export const getNextPeriodInfo = (data: INextPeriodInfo) => {
  return get<DNextPeriodInfo>("/api/win/next_period_info", { data });
};

export function addUserGuess(data: IAddUserGuess){
  return post<DResults>("/api/win/add_user_guess", { data });
};
export function getMyGuess(data: IMyGuess){
  return get<DMyGuess>("/api/win/my_guesses", { data });
};

export function getMyGuessResult(data: IMyGuessResult){
  return get<DMyGuessResult>("/api/win/my_guess_result", { data });
};
