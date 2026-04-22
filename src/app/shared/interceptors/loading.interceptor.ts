import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { GlobalLoadingService } from '../components/global-loading-indicator/global-loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const globalLoading = inject(GlobalLoadingService);
  globalLoading.show();
  return next(req).pipe(finalize(() => globalLoading.hide()));
};
