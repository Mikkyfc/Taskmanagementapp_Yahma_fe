import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { store } from '../config/config';
import { NotificationServicesService } from '../services/notification-services.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notifier: NotificationServicesService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = store.getItem('token');

    const authReq = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${token}`)
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different error status codes
        if (error.status === 401) {
          this.notifier.ShowMessage('Session expired. Please log in again.', false);
          this.router.navigate(['/']);
        } else if (error.status === 403) {
          this.notifier.ShowMessage('You do not have permission to perform this action.', false);
        } else if (error.status === 500) {
          this.notifier.ShowMessage('Server error. Please try again later.', false);
        } else if (error.status === 0) {
          this.notifier.ShowMessage('Network error. Please check your internet connection.', false);
        } else {
          this.notifier.ShowMessage(error.error?.message || 'An unexpected error occurred.', false);
        }

        return throwError(() => error);
      })
    );
  }
}
