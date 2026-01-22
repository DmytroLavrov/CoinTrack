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
