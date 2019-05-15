import {Nominee} from './nominee';
import {Winner} from './winner';

export interface Award {
  id: number;
  awardType?: AwardType;
  name?: string;
  year: number;
  status: number;
  description: string;
  date_start: Date;
  date_end: Date;
  prize: string;
  item: string;
  logo_url: string;
  created_at: Date;
  updated_at: Date;
  nominee: Nominee[];
  winner: Winner;
}
interface AwardType {
  id: number;
  name: string;
}

