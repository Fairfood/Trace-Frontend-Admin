/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate() {
    if (localStorage.getItem('isFairfoodAdminLoggedin')) {
      return this.isVerified();
    }

    window.location.href = environment.authUrl;
    return false;
  }

  isVerified(): boolean {
    const localItem = localStorage.getItem('adminData');
    const user: any = localItem && JSON.parse(localItem);
    if (user.email_verified) {
      if (user.type === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      window.location.href = environment.authUrl;
      return false;
    }
  }
}
