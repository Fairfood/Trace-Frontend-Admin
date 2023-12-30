/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedIn implements CanActivate {
  constructor(private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot) {
    if (localStorage.getItem('isFairfoodAdminLoggedin')) {
      const params: any = next.queryParams;
      // check if it's a magic link
      if (params.token && params.salt && params.user) {
        return true;
      } else {
        return this.isVerified();
      }
    } else {
      return true;
    }
  }

  isVerified() {
    const localItem = localStorage.getItem('adminData');
    const user: any = localItem && JSON.parse(localItem);
    if (user.email_verified) {
      if (user.type == 2) {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
