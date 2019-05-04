export interface Nominee {
  id_nominee: number;
  nominee_name?: NomineeName;
  id_award?: number;
  id_team?: number;
  updated_at?: Date;
}
interface NomineeName {
  first_name?: string;
  last_name?: string;
  english_name?: string;
}

