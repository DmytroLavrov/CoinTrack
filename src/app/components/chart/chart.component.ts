import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ChartDataPoint } from '@models/ticker-data.model';
import { CryptoService } from '@services/crypto.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  imports: [NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  private cryptoService: CryptoService = inject(CryptoService);

  // Array of points for the graph
  public chartData = signal<ChartDataPoint[]>([]);

  // Maximum number of points (60 seconds of history)
  private readonly MAX_POINTS = 60;

  // Interval for adding points (1 second)
  private interval?: number;

  // Color scheme for the graph
  public colorScheme: Color = {
    name: 'crypto',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#667eea', '#764ba2'],
  };

  // Curve type (smooth line)
  public curve: any;

  // Formatted array for ngx-charts
  public formattedChartData = signal<any[]>([]);

  // Current coin tracking
  private lastSymbol = '';

  constructor() {
    // Import curveMonotoneX for smooth lines
    import('d3-shape').then((d3) => {
      this.curve = d3.curveMonotoneX;
    });

    // Effect: update formattedChartData when chartData changes
    effect(() => {
      const data = this.chartData();
      this.formattedChartData.set([
        {
          name: 'BTC Price',
          series: data.map((point) => ({
            name: new Date(point.timestamp),
            value: point.price,
          })),
        },
      ]);
    });
  }

  ngOnInit(): void {
    // Add a new point every second
    this.interval = window.setInterval(() => {
      this.addDataPoint();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Adding a new point
  private addDataPoint(): void {
    const tickerData = this.cryptoService.tickerData();

    // If price = 0, no data received yet
    if (tickerData.price === 0) return;

    // If the symbol has changed, clear the graph.
    if (this.lastSymbol && this.lastSymbol !== tickerData.symbol) {
      this.chartData.set([]);
    }
    this.lastSymbol = tickerData.symbol;

    const newPoint: ChartDataPoint = {
      timestamp: Date.now(),
      price: tickerData.price,
    };

    // Update the array
    this.chartData.update((data) => {
      const updated = [...data, newPoint];

      // Delete old points (leave only the last 60)
      if (updated.length > this.MAX_POINTS) {
        return updated.slice(updated.length - this.MAX_POINTS);
      }

      return updated;
    });
  }

  // X-OSI formatting (Time)
  public formatXAxis = (val: any): string => {
    const date = new Date(val);
    return date.toLocaleTimeString('en-US', {
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Y-OSI formatting (Time)
  public formatYAxis = (val: number): string => {
    return `$${val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };
}
