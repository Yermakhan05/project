import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import { LanguageService } from './language.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(private languageService: LanguageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.languageService.language$.pipe( // 🔥 Получаем актуальный язык в момент запроса
      switchMap(language => {
        const modifiedReq = req.clone({
          setHeaders: { 'Accept-Language': language },
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
