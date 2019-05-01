export interface Winner {
  id_winner: number;
  percent: number;
  winner_name?: WinnerName;
}
interface WinnerName {
  first_name: string;
  last_name: string;
  english_name: string;
}


