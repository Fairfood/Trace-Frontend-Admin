import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

import { LoginRoutingModule } from './login-routing.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
// components
import { LoginComponent } from './login.component';
import { VerifyComponent } from './verify/verify.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';

@NgModule({
  declarations: [LoginComponent, VerifyComponent, LogoutDialogComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    TranslateModule.forChild(),
    LoaderModule,
    MatDialogModule,
    ButtonsComponent,
  ],
})
export class LoginModule {}
