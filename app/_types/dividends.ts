export interface Dividend {
  id: number;
  user_id: string; // uuid
  company_id: number; // id
  no_of_shares: number;
  amount_per_share: number;
  tax_amount: number;
  created_at: string;
}

export interface DividendResponse {
  data: Dividend[];
  total: number;
}