interface IGuesses {
  p: number;
  p_size: number;
  category: string;
  min_type: number;
}
interface INextPeriodInfo {
  min_type: number;
}

interface GuessesPage {
  count: number;
  num_pages: number;
  current_page: number;
}

interface GuessesQueryset {
  period: number;
  price: number;
  last_num: number;
  is_green: boolean;
  is_red: boolean;
  is_violet: boolean;
  create_time: string;
  create_timestamp: number;
}

interface DGuesses {
  code: number;
  page: GuessesPage;
  queryset: Array<GuessesQueryset>;
  next_period: number;
  balance: number;
  count_down_sec: number;
}

interface DNextPeriodInfo {
  code: number;
  balance: number;
  next_period: string;
  count_down_sec: number;
  latest_open_numbers: Array<number>;
}

interface DResults {
  code: number;
  msg: string;
}

interface IAddUserGuess {
  category: string;
  contract_count: number;
  contract_money: number;
  guess_type: string;
  period: number;
  min_type: number;
  number: number;
}

interface MyGuessPage {
  count: number;
  num_pages: number;
  current_page: string;
}

interface MyGuessQueryset {
  id: number;
  period: number;
  type: string;
  status: string;
  number: number;
  contract_money: string;
  contract_count: number;
  delivery: string;
  fee: string;
  open_price: number;
  result: string;
  create_time: string;
  create_timestamp: number;
  amount:number;
  delivery:string;
}

interface DMyGuess {
  code: number;
  page: MyGuessPage;
  queryset: Array<MyGuessQueryset>;
  next_period: string;
  balance: number;
}
interface IMyGuess {
  min_type: number;
  p: number;
  p_size: number;
}
interface IMyGuessResult {
  min_type: number;
  period: string;
}
interface DMyGuessResult {
  code: number;
  queryset: Array<MyGuessResultQueryset>;
}

interface MyGuessResultQueryset {
  id: number;
  period: number;
  type: string;
  status: string;
  number: number;
  contract_money: string;
  contract_count: number;
  delivery: string;
  fee: string;
  open_price: number;
  result: string;
  amount: string;
  create_time: string;
  create_timestamp: number;
}
