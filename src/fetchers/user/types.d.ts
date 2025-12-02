interface DAccountInfo {
    balance: number;
    bet_count: number;
    bet_sum: number;
    win_sum: number;
    vip_recharge_sum: number;
    vip_bet_sum: number;
    stack: number;
    available_withdrawal_amount: number;
    promotion_rewards_sum: number;
    vip_rank: number;
    next_vip_rank: number;
    next_vip_rank_growth_value: number;
    next_vip_rank_growth_bet: number;
    vip_deposit_scale: number;
    vip_bet_scale: number;
    rescue_values: RescueValues[];
  }

  interface OwnGamesPage {
    count: number;
    num_pages: number;
    current_page: number;
  };
  
  interface OwnGamesQueryset {
    type: string;
    image: string;
    name: string;
    category: string;
    enable: boolean;
    hot: boolean;
    order_by: number;
    min_bet: number;
    max_bet: number;
    addition1: null;
    addition2: null;
    addition3: null;
  };
  
  interface DOwnGames {
    code: number;
    page: OwnGamesPage;
    queryset: Array<OwnGamesQueryset>;
  };
  