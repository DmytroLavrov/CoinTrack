/**
 * CRYPTO SYMBOL
 *
 * Information about a cryptocurrency trading pair
 * (used later for a multi-coin table)
 */
export interface CryptoSymbol {
  symbol: string; // Trading pair symbol (BTCUSDT, ETHUSDT)
  name: string; // Full name (Bitcoin / Tether)
  baseAsset: string; // Base asset (BTC, ETH)
  quoteAsset: string; // Quote asset (USDT, BUSD)
  icon?: string; // Coin icon URL
  rank?: number; // Market cap rank
  isFavorite?: boolean; // Marked as favorite (UI state)
}

/**
 * POPULAR SYMBOLS
 *
 * Predefined popular trading pairs (quick start)
 */
export const POPULAR_SYMBOLS: CryptoSymbol[] = [
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin / Tether',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    rank: 1,
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum / Tether',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    rank: 2,
  },
  {
    symbol: 'BNBUSDT',
    name: 'Binance Coin / Tether',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    rank: 3,
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana / Tether',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    rank: 4,
  },
  {
    symbol: 'XRPUSDT',
    name: 'Ripple / Tether',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    rank: 5,
  },
];
