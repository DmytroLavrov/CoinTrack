import { Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { ConnectionStatus, PriceTrend, TickerData } from '@models/ticker-data.model';
import { Subject, throttleTime } from 'rxjs';
import { BinanceTrade } from '@models/trade.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService implements OnDestroy {
  private ws?: WebSocket;

  // Previous price (to determine trend)
  private previousPrice: number = 0;

  // Current ticker data
  public tickerData = signal<TickerData>({
    symbol: 'BTCUSDT',
    price: 0,
    priceFormatted: '0.00',
    timestamp: Date.now(),
    trend: PriceTrend.NEUTRAL,
  });

  public connectionStatus: WritableSignal<ConnectionStatus> = signal<ConnectionStatus>(
    ConnectionStatus.CONNECTING,
  );

  // Raw data stream from Binance
  private tradeStream$ = new Subject<BinanceTrade>();

  // Error stream
  private errorStream$ = new Subject<string>();

  constructor() {
    // Connect when the service starts
    this.connectWebSocket('btcusdt');

    this.tradeStream$
      .pipe(
        throttleTime(100), // Update UI a maximum of 10 times/second
      )
      .subscribe((trade) => this.updateTickerData(trade));
  }

  // Connect to WebSocket
  public connectWebSocket(symbol: string): void {
    this.disconnectWebSocket();

    const streamName = `${symbol.toLowerCase()}@trade`;
    const url = `${environment.wsUrl}/${streamName}`;

    this.connectionStatus.set(ConnectionStatus.CONNECTING);

    try {
      this.ws = new WebSocket(url);

      // Event: Connection established
      this.ws.onopen = () => {
        console.log('WebSocket connected:', streamName);
        this.connectionStatus.set(ConnectionStatus.CONNECTED);
      };

      // Event: Data received
      this.ws.onmessage = (event) => {
        try {
          const trade: BinanceTrade = JSON.parse(event.data);
          this.tradeStream$.next(trade);
        } catch (error) {
          console.error('Parse error:', error);
        }
      };

      // Event: Error
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionStatus.set(ConnectionStatus.ERROR);
        this.errorStream$.next('WebSocket error occurred');
      };

      // Event: Connection closed
      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        this.connectionStatus.set(ConnectionStatus.DISCONNECTED);

        // Automatic reconnect after 3 seconds
        if (!event.wasClean) {
          setTimeout(() => {
            console.log('Reconnecting...');
            this.connectionStatus.set(ConnectionStatus.RECONNECTING);
            this.connectWebSocket(symbol);
          }, 3000);
        }
      };
    } catch (error) {}
  }

  // Disconnect to WebSocket
  public disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.onclose = null;

      this.ws.close(1000, 'User disconnected');
      this.ws = undefined;
    }
  }

  // Tiker data update
  private updateTickerData(trade: BinanceTrade): void {
    const price = parseFloat(trade.p);

    // Determine the trend (compare with the previous price)
    let trend = PriceTrend.NEUTRAL;
    if (this.previousPrice > 0) {
      if (price > this.previousPrice) {
        trend = PriceTrend.UP;
      } else if (price < this.previousPrice) {
        trend = PriceTrend.DOWN;
      }
    }

    this.tickerData.set({
      symbol: trade.s,
      price: price,
      priceFormatted: this.formatPrice(price),
      timestamp: trade.T,
      trend: trend,
    });

    // Save for next comparison
    this.previousPrice = price;
  }

  // Price format: 45678.90 → "45,678.90"
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  // Changing the symbol
  public changeSymbol(symbol: string): void {
    this.previousPrice = 0; // Reset history
    this.connectWebSocket(symbol);
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
    this.tradeStream$.complete();
    this.errorStream$.complete();
  }
}
