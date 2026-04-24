import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { GlobalLoadingService } from '../components/global-loading-indicator/global-loading.service';

export const SKIP_GLOBAL_LOADING = new HttpContextToken(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_GLOBAL_LOADING)) {
    return next(req);
  }
  const globalLoading = inject(GlobalLoadingService);
  globalLoading.show();
  return next(req).pipe(finalize(() => globalLoading.hide()));
};
