import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// other modules
import { DashboardRoutingModule } from './dashboard-routing.module';

// component
import { DashboardComponent } from './dashboard.component';
import { LineGraphDashboardComponent } from './line-graph-dashboard/line-graph-dashboard.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { ChartLineComponent } from 'src/app/shared/components/chart-line';
import { LoaderComponent } from 'fairfood-utils';
import { FfDropdownComponent } from 'fairfood-form-components';

@NgModule({
  declarations: [
    DashboardComponent,
    LineGraphDashboardComponent,
    MapChartComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    TranslateModule.forChild(),
    ChartLineComponent,
    MatMenuModule,
    FfDropdownComponent,
    LoaderComponent,
  ],
})
export class DashboardModule {}
