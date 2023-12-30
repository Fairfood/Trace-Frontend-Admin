import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// custom modules
import { FeatureRoutingModule } from './feature-routing.module';
import { CoreModule } from '../core/core.module';
// components
import { FeatureComponent } from './feature.component';
import { InternetAlertComponent } from '../core/components/internet-alert/internet-alert.component';
import { SidebarComponent } from '../core/components/sidebar/sidebar.component';
@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    CoreModule,
    InternetAlertComponent,
    SidebarComponent,
  ],
})
export class FeatureModule {}
