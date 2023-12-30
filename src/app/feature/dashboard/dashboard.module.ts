import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// other modules
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
// component
import { DashboardComponent } from './dashboard.component';
import { LineGraphDashboardComponent } from './line-graph-dashboard/line-graph-dashboard.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { ChartLineComponent } from 'src/app/shared-modules/chart-line/chart-line.component';

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
    LoaderModule,
    TranslateModule.forChild(),
    ChartLineComponent,
    MatMenuModule,
    FairFoodDropdownModule,
  ],
})
export class DashboardModule {}
