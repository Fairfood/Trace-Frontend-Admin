import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from 'src/environments/environment';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // first time login
  if (state.url.includes('dashboard?code=')) {
    return true;
  } else {
    if (localStorage.getItem('isFairfoodAdminLoggedin')) {
      return isVerified();
    }
  }

  return toLogin();
};

export function isVerified(): boolean {
  const localItem = localStorage.getItem('adminData');
  const user: any = localItem && JSON.parse(localItem);
  if (user.email_verified) {
    if (user.type === 1) {
      return false;
    } else {
      return true;
    }
  } else {
    return toLogin();
  }
}

/* istanbul ignore next */
export function toLogin(): boolean {
  window.location.href = environment.authenticateUrl;
  return true;
}
