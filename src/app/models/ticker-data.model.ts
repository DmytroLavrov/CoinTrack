import { BinanceTrade } from 'src/app/models/trade.model';

export interface TickerData {
  symbol: string; // Trading pair symbol (BTCUSDT, ETHUSDT)
  price: number; // Current price (number for calculations)
  priceFormatted: string; // Formatted price for UI ("45,678.90")
  timestamp: number; // Last update timestamp
  trend: PriceTrend; // Price movement direction
  change24h?: number; // 24h price change (percentage)
  volume24h?: number; // 24h trading volume
}

/**
 * PRICE TREND
 *
 * Direction of price movement
 * (used for animations and color indicators)
 */
export enum PriceTrend {
  UP = 'up', // Green (price increased)
  DOWN = 'down', // Red (price decreased)
  NEUTRAL = 'neutral', // No change
}

/**
 * CHART DATA POINT
 *
 * Single point on a price chart
 */
export interface ChartDataPoint {
  timestamp: number; // Time (X-axis)
  price: number; // Price (Y-axis)
}

/**
 * CONNECTION STATUS
 *
 * WebSocket connection state
 */
export enum ConnectionStatus {
  CONNECTING = 'connecting', // Yellow indicator
  CONNECTED = 'connected', // Green indicator
  DISCONNECTED = 'disconnected', // Red indicator
  RECONNECTING = 'reconnecting', // Orange indicator
  ERROR = 'error', // Error state
}

/**
 * WEBSOCKET MESSAGE
 *
 * Type-safe WebSocket message payload
 */
export type WebSocketMessage = BinanceTrade;
