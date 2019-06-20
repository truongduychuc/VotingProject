export interface Winner {
  id_award?: number;
  id_winner: number;
  percent: number;
  winner_name?: WinnerName;
}
export interface WinnerName {
  first_name: string;
  last_name: string;
  english_name: string;
}


