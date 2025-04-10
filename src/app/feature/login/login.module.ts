import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

import { LoginRoutingModule } from './login-routing.module';
// components
import { LoginComponent } from './login.component';
import { VerifyComponent } from './verify/verify.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { ButtonsComponent, LoaderComponent } from 'fairfood-utils';

@NgModule({
  declarations: [LoginComponent, VerifyComponent, LogoutDialogComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    TranslateModule.forChild(),
    MatDialogModule,
    ButtonsComponent,
    LoaderComponent,
  ],
})
export class LoginModule {}
