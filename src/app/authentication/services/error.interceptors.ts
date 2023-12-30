/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './auth/auth.service';
import { SnackBarComponent } from 'src/app/core/components/snack-bar/snack-bar.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public _authService: AuthService,
    public _snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        let error = '';
        if (!window.navigator.onLine) {
          this.noInternetSnackBar();
        }
        if ([401].indexOf(err.status) !== -1) {
          this._authService.logoutWithoutApi();
        }
        if (err.error !== undefined) {
          error = err;
        } else if (err.statusText !== undefined) {
          error = err;
        }
        return throwError(() => error);
      })
    );
  }

  noInternetSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Network Error! Check your Internet Connection',
        icon: 'Error',
      },
      panelClass: 'snackbar-color',
      duration: 3000,
    });
  }

  noAccessSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'User role was updated, Redirecting to home page.',
        icon: 'Error',
      },
      panelClass: 'snackbar-color',
      duration: 3000,
    });
  }
}
