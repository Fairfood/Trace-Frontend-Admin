/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
// services
import { DashboardService } from '../dashboard.service';
import { DataService } from 'src/app/core/data.service';
import { HeaderFilter } from 'src/app/core/utils/app.constants';

// constants
const TOOLTIP_DATA = {
  toggleKey: 'active',
  interactive: true,
  stroke: am5.color(0xffffff),
  strokeWidth: 2,
};

// this is a component rendering the world map using the amcharts 5

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss'],
})
export class MapChartComponent implements AfterViewInit, OnDestroy {
  pageApis: Subscription[] = [];
  polygonSeries: any;
  mapFilter = 'All';
  mapActorTypes = ['All', 'Farmer', 'Company'];
  pointSeries: any;
  countryData: any[] = [];
  selectedSupplyChain = '';

  constructor(
    private zone: NgZone,
    private dashboardService: DashboardService,
    private dataService: DataService
  ) {}

  getWorldMapData(): void {
    const api = this.dashboardService
      .worldMapData(this.selectedSupplyChain)
      .subscribe(data => {
        if (data.length) {
          this.countryData = data;
        } else {
          this.countryData = [];
        }
        this.setPolygonData('count');
      });
    this.pageApis.push(api);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // creating instance
      const root = am5.Root.new('chartdiv');

      root.setThemes([am5themes_Animated.new(root)]);
      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'translateX',
          panY: 'translateY',
          minZoomLevel: 1,
          maxZoomLevel: 16,
          zoomLevel: 2,
          projection: am5map.geoMercator(),
        })
      );

      // drawing countries with custom data
      this.polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ['AQ'],
          fill: am5.color('#D5EEF7'),
          stroke: am5.color(0xffffff),
        })
      );

      const tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
      });

      tooltip.get('background').setAll({
        fill: am5.color(0xffffff),
      });

      this.polygonSeries.set('tooltip', tooltip);

      this.polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}{value}',
        templateField: 'polygonSettings',
        ...TOOLTIP_DATA,
      });
    });
    // api call init happens here
    const supplyChainChanges =
      this.dataService.supplyChainDataChanged.subscribe(
        (result: HeaderFilter) => {
          if (result) {
            const { type, value } = result;
            if (type === 'supplyChain') {
              this.selectedSupplyChain = value;
              this.getWorldMapData();
            }
          }
        }
      );
    this.pageApis.push(supplyChainChanges);
    this.getWorldMapData();
  }

  changeLegend(item: string): void {
    this.polygonSeries.data.setAll([]);
    this.mapFilter = item;
    let key = '';
    if (item === 'Farmer') {
      key = `farmer_count`;
    } else if (item === 'Company') {
      key = `company_count`;
    } else {
      key = `count`;
    }
    this.setPolygonData(key);
  }

  setPolygonData(key: string): void {
    const seriesSet: any = [];
    this.countryData.map((c: any) => {
      const valueText = `\n\nFarmers: ${c.farmer_count}\nCompanies: ${c.company_count}`;
      if (c[key] > 0) {
        seriesSet.push({
          id: c.country_code,
          name: c.country,
          value: valueText,
          polygonSettings: {
            fill: am5.color('#92DDF6'),
          },
        });
      }
    });
    this.polygonSeries.data.setAll(seriesSet);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
