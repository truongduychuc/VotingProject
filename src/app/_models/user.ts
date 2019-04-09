export interface User {
  id: number;
  id_role: number;
  id_team: number;
  is_active: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  english_name: string;
  email: string;
  phone: string;
  address: string;
  other: string;
  ava_url: string;
  created_at: Date;
  updated_at: Date;
}
