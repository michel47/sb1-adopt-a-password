export interface Password {
  id: string;
  value: string;
  pwnedCount: number;
  startingPrice: number;
  currentPrice: number | null;
  owner: string | null;
  reservePrice: number;
  sold: boolean;
}

export interface Bid {
  passwordId: string;
  bidder: string;
  amount: number;
  timestamp: Date;
}