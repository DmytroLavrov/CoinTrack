import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  untracked,
  ViewChild,
} from '@angular/core';
import { CandleDataPoint } from '@models/ticker-data.model';
import { CryptoService } from '@services/crypto.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeries,
} from 'lightweight-charts';

@Component({
  selector: 'app-chart',
  imports: [NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  private cryptoService: CryptoService = inject(CryptoService);

  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  private chart?: IChartApi;
  private candlestickSeries?: ISeriesApi<'Candlestick'>;

  private currentPrice = computed(() => this.cryptoService.tickerData().price);
  private currentSymbol = computed(() => this.cryptoService.tickerData().symbol);

  private lastCandle: CandleDataPoint | null = null;

  constructor() {
    // Effect: follow the price change (Real-time updates)
    effect(() => {
      const price = this.currentPrice();
      // Use untracked to access lastCandle to avoid creating unnecessary dependencies,
      // although it's not critical here, because lastCandle is not a signal.
      untracked(() => {
        this.updateLiveCandle(price);
      });
    });

    // Effect: follow the change of the symbol
    effect(() => {
      const symbol = this.currentSymbol();

      // Use untracked to avoid creating an infinite loop
      // if chartData were to be read internally (this is just a precaution)
      untracked(() => {
        if (symbol) {
          this.loadHistory(symbol);
        }
      });
    });
  }
  ngAfterViewInit(): void {
    // Initialize the graph
    this.chart = createChart(this.chartContainer.nativeElement, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#A0AEC0',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Setting up a series of candles
    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#48BB78',
      downColor: '#F56565',
      borderUpColor: '#48BB78',
      borderDownColor: '#F56565',
      wickUpColor: '#48BB78',
      wickDownColor: '#F56565',
    });

    // Make the graph adaptive
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== this.chartContainer.nativeElement) return;
      const newRect = entries[0].contentRect;
      this.chart?.applyOptions({ width: newRect.width, height: newRect.height });
    });
    resizeObserver.observe(this.chartContainer.nativeElement);
  }

  // Loading history
  private loadHistory(symbol: string): void {
    this.cryptoService.fetchHistory(symbol).subscribe({
      next: (data) => {
        if (this.candlestickSeries && data.length > 0) {
          // Load data
          this.candlestickSeries.setData(data as CandlestickData[]);

          // Remember the last candle to continue updating it
          this.lastCandle = { ...data[data.length - 1] };

          // Focus the graph on the latest data
          this.chart?.timeScale().fitContent();
        }
      },
      error: (err) => console.error('Failed to load history:', err),
    });
  }

  private updateLiveCandle(price: number): void {
    if (!this.candlestickSeries || !this.lastCandle || price === 0) return;

    // Round the current time to the first minute (to know if a new candle has started)
    // Divide by 60, round, multiply by 60.
    const now = Math.floor(Date.now() / 1000);
    const candleTimeStep = 60; // 1 minute
    const currentCandleTime = Math.floor(now / candleTimeStep) * candleTimeStep;

    if (currentCandleTime === this.lastCandle.time) {
      // === UPDATE CURRENT CANDLE ===
      // Update High/Low/Close
      this.lastCandle.close = price;
      if (price > this.lastCandle.high) this.lastCandle.high = price;
      if (price < this.lastCandle.low) this.lastCandle.low = price;

      this.candlestickSeries.update(this.lastCandle as CandlestickData);
    } else if (currentCandleTime > this.lastCandle.time) {
      // === CREATING A NEW CANDLE ===
      const newHandle: CandleDataPoint = {
        time: currentCandleTime,
        open: this.lastCandle.close, // Opening = closing of the previous one
        high: price,
        low: price,
        close: price,
      };

      this.lastCandle = newHandle;
      this.candlestickSeries.update(this.lastCandle as CandlestickData);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.remove();
    }
  }
}
