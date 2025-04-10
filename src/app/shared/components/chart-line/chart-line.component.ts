/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chart-line',
  standalone: true,
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent implements AfterViewInit, OnChanges {
  @Input() chartData: any[];
  @Input() colorSchemeDomain: string[] = ['#5691AE', '#003A60'];

  @Input() chartHeight = 300;
  @Input() graphId: string;

  private root!: am5.Root;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { chartData } = changes;
    if (!chartData.firstChange) {
      this.browserOnly(() => {
        if (this.root) {
          this.root.dispose();
        }
      });
      setTimeout(() => {
        this.createChart();
      });
    }
  }

  private createChart(): void {
    // Chart code goes in here
    this.browserOnly(() => {
      const root = am5.Root.new(`lineChartDiv${this.graphId}`);

      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout,
        })
      );

      // Create Y-axis
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      // Create X-Axis
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 20,
          }),
          categoryField: 'name',
        })
      );
      xAxis.data.setAll(this.chartData[0].series);

      const commonConfig = {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'name',
        tension: 0.2,
      };

      this.chartData.forEach((chartItem: any, index: number) => {
        // Create series multiple ( As of now max 2)
        const series = chart.series.push(
          am5xy.SmoothedXYLineSeries.new(root, {
            name: chartItem.name,
            ...commonConfig,
            stroke: am5.color(this.colorSchemeDomain[index]),
          })
        );
        series.data.setAll(chartItem.series);
        const tooltip = am5.Tooltip.new(root, {
          getFillFromSprite: false,
          autoTextColor: false,
          labelText: `${chartItem.name}: {valueY}`,
        });

        tooltip.get('background').setAll({
          fill: am5.color(0xffffff),
          fillOpacity: 0.8,
          stroke: am5.color(this.colorSchemeDomain[index]),
          strokeOpacity: 0.8,
        });
        tooltip.label.setAll({
          fill: am5.color(this.colorSchemeDomain[index]),
        });

        series.set('tooltip', tooltip);
      });

      // Enable cursor
      chart.set('cursor', am5xy.XYCursor.new(root, {}));

      this.root = root;
    });
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
