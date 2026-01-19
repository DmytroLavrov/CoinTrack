export interface BinanceTrade {
  e: string; // Event type (always "trade")
  E: number; // Event time (timestamp in milliseconds)
  s: string; // Symbol (e.g. "BTCUSDT")
  t: number; // Trade ID
  p: string; // Price (string to avoid precision loss)
  q: string; // Quantity (amount of the asset traded)
  b: number; // Buyer order ID
  a: number; // Seller order ID
  T: number; // Trade time (timestamp)
  m: boolean; // Is the buyer the market maker? (true = sell, false = buy)
  M: boolean; // Ignore (always true)
}

/**
 * Example real trade event:
 *
 * {
 *   "e": "trade",
 *   "E": 1672515782136,
 *   "s": "BTCUSDT",
 *   "t": 12345,
 *   "p": "16596.50",
 *   "q": "0.014",
 *   "T": 1672515782136,
 *   "m": true,
 *   "M": true
 * }
 */
