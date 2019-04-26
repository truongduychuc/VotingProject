export interface Nominee {
  id_nominee: number;
  nominee_name?: NomineeName
}
interface NomineeName {
  first_name?: string;
  last_name?: string;
  english?: string;
}
