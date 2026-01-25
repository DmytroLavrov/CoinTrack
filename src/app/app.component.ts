import { Component, computed, inject } from '@angular/core';
import { CryptoService } from '@services/crypto.service';
import { ConnectionStatus, PriceTrend } from '@models/ticker-data.model';
import { ChartComponent } from '@components/chart/chart.component';

@Component({
  selector: 'app-root',
  imports: [ChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public cryptoService: CryptoService = inject(CryptoService);

  // List of coins for the selector
  public coins = [
    { id: 'BTCUSDT', name: 'BTC' },
    { id: 'ETHUSDT', name: 'ETH' },
    { id: 'SOLUSDT', name: 'SOL' },
  ];

  // Method for changing the coin
  public selectCoin(symbol: string): void {
    // Don't reconnect if the coin is already selected
    if (this.cryptoService.tickerData().symbol === symbol) return;

    this.cryptoService.changeSymbol(symbol);
  }

  public statusClass = computed(() => {
    const status = this.cryptoService.connectionStatus();
    return `status-${status}`;
  });

  public statusDotClass = computed(() => {
    const status = this.cryptoService.connectionStatus();
    return status;
  });

  public statusText = computed(() => {
    const status = this.cryptoService.connectionStatus();
    const textMap = {
      [ConnectionStatus.CONNECTING]: 'Connecting to Binance...',
      [ConnectionStatus.CONNECTED]: 'Live',
      [ConnectionStatus.DISCONNECTED]: 'Disconnected',
      [ConnectionStatus.RECONNECTING]: 'Reconnecting...',
      [ConnectionStatus.ERROR]: 'Connection Error',
    };
    return textMap[status];
  });

  public isTrendUp = computed(() => this.cryptoService.tickerData().trend === PriceTrend.UP);
  public isTrendDown = computed(() => this.cryptoService.tickerData().trend === PriceTrend.DOWN);

  public isFlashUp = computed(() => this.isTrendUp());
  public isFlashDown = computed(() => this.isTrendDown());

  public formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
