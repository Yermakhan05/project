import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('ru'); // По умолчанию английский
  language$ = this.languageSubject.asObservable(); // Доступный стрим

  setLanguage(lang: string) {
    this.languageSubject.next(lang);
    localStorage.setItem('language', lang); // Сохраняем язык в localStorage
  }

  getLanguage(): string {
    return localStorage.getItem('language') || 'ru';
  }
}
