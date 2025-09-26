import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(LoadingService);
   busyService.busy();
  return next(req).pipe(
    finalize(() => busyService.idle())
  );
};
